import 'dart:io';
import 'dart:convert';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:shared_preferences/shared_preferences.dart';

// Import for web support
import 'package:idb_shim/idb_browser.dart';

import 'package:valuva/models/models.dart';

/// A simplified storage service for the prototype
/// For the prototype, we'll store projects in memory only and
/// just show placeholders for web platform
class StorageService {
  static const String _projectsFolder = 'projects';
  static const String _assetsFolder = 'assets';
  
  // Constants for web storage
  static const String _dbName = 'valuvaDB';
  static const int _dbVersion = 1;
  static const String _projectsStore = 'projects';
  static const String _assetsStore = 'assets';

  // Web database factory
  static IdbFactory? _webDbFactory;
  
  // Initialize web database
  Future<IdbFactory> get _webDb async {
    _webDbFactory ??= getIdbFactory();
    return _webDbFactory!;
  }

  // Open the IndexedDB database for web
  Future<Database> _openWebDb() async {
    final factory = await _webDb;
    return factory.open(_dbName, version: _dbVersion, 
      onUpgradeNeeded: (VersionChangeEvent event) {
        final db = event.database;
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(_projectsStore)) {
          db.createObjectStore(_projectsStore, keyPath: 'id');
        }
        if (!db.objectStoreNames.contains(_assetsStore)) {
          db.createObjectStore(_assetsStore, keyPath: 'path');
        }
      }
    );
  }

  // In-memory storage for the prototype
  final Map<String, Project> _memoryProjects = {};

  /// Get the application documents directory
  Future<Directory> get _appDocDir async {
    if (kIsWeb) {
      throw UnsupportedError('Local filesystem is not supported on web platform');
    }
    return await getApplicationDocumentsDirectory();
  }

  /// Get the projects directory
  Future<Directory> get _projectsDir async {
    if (kIsWeb) {
      throw UnsupportedError('Local filesystem is not supported on web platform');
    }
    
    final appDir = await _appDocDir;
    final dir = Directory(path.join(appDir.path, _projectsFolder));
    if (!await dir.exists()) {
      await dir.create(recursive: true);
    }
    return dir;
  }

  /// Get project assets directory for a specific project
  Future<Directory> _getProjectAssetsDir(String projectId) async {
    if (kIsWeb) {
      throw UnsupportedError('Local filesystem is not supported on web platform');
    }
    
    final appDir = await _appDocDir;
    final dir = Directory(
      path.join(appDir.path, _projectsFolder, projectId, _assetsFolder)
    );
    if (!await dir.exists()) {
      await dir.create(recursive: true);
    }
    return dir;
  }

  /// Save a project
  Future<void> saveProject(Project project) async {
    // For prototype: just store in memory
    _memoryProjects[project.id] = project;
    
    // For native platforms, also try to save to disk
    if (!kIsWeb) {
      try {
        final projectsDir = await _projectsDir;
        final projectDir = Directory(path.join(projectsDir.path, project.id));
        
        if (!await projectDir.exists()) {
          await projectDir.create(recursive: true);
        }
        
        final projectFile = File(path.join(projectDir.path, 'project.json'));
        await projectFile.writeAsString(project.toJsonString());
      } catch (e) {
        print('Error saving project to disk: $e');
        // Continue without error since we have it in memory
      }
    }
  }

  /// Load a project
  Future<Project?> loadProject(String projectId) async {
    // First check memory cache
    if (_memoryProjects.containsKey(projectId)) {
      return _memoryProjects[projectId];
    }
    
    // For web, we don't have persistence in the prototype
    if (kIsWeb) {
      return null;
    }
    
    // Try to load from disk on native platforms
    try {
      final projectsDir = await _projectsDir;
      final projectFile = File(
        path.join(projectsDir.path, projectId, 'project.json')
      );
      
      if (await projectFile.exists()) {
        final jsonString = await projectFile.readAsString();
        final project = Project.fromJsonString(jsonString);
        
        // Cache it in memory
        _memoryProjects[projectId] = project;
        
        return project;
      }
    } catch (e) {
      print('Error loading project from disk: $e');
    }
    
    return null;
  }

  /// Delete a project
  Future<bool> deleteProject(String projectId) async {
    // Remove from memory
    _memoryProjects.remove(projectId);
    
    // For web, that's all we need to do in the prototype
    if (kIsWeb) {
      return true;
    }
    
    // Try to delete from disk on native platforms
    try {
      final projectsDir = await _projectsDir;
      final projectDir = Directory(path.join(projectsDir.path, projectId));
      
      if (await projectDir.exists()) {
        await projectDir.delete(recursive: true);
        return true;
      }
    } catch (e) {
      print('Error deleting project from disk: $e');
    }
    
    return true; // Succeeds even if just removed from memory
  }

  /// List all saved projects
  Future<List<Project>> listProjects() async {
    // Start with memory projects
    final projects = _memoryProjects.values.toList();
    
    // For web, that's all we have in the prototype
    if (kIsWeb) {
      return projects;
    }
    
    // Try to load from disk on native platforms
    try {
      final projectsDir = await _projectsDir;
      
      if (await projectsDir.exists()) {
        final projectDirs = await projectsDir.list().toList();
        
        for (var entity in projectDirs) {
          if (entity is Directory) {
            final projectId = path.basename(entity.path);
            
            // Skip if already in memory
            if (_memoryProjects.containsKey(projectId)) {
              continue;
            }
            
            final projectFile = File(path.join(entity.path, 'project.json'));
            if (await projectFile.exists()) {
              try {
                final jsonString = await projectFile.readAsString();
                final project = Project.fromJsonString(jsonString);
                
                // Cache it in memory
                _memoryProjects[projectId] = project;
                
                // Add to the list if not already present
                if (!projects.any((p) => p.id == projectId)) {
                  projects.add(project);
                }
              } catch (e) {
                print('Error parsing project: $e');
              }
            }
          }
        }
      }
    } catch (e) {
      print('Error listing projects from disk: $e');
    }
    
    // Sort projects by modified date (newest first)
    projects.sort((a, b) => b.modified.compareTo(a.modified));
    
    return projects;
  }

  /// Save an image asset
  Future<String> saveImageAsset(String projectId, File imageFile) async {
    if (kIsWeb) {
      // For prototype, just return a placeholder path
      return 'assets/placeholder.png';
    }
    
    try {
      final assetsDir = await _getProjectAssetsDir(projectId);
      final fileName = '${DateTime.now().millisecondsSinceEpoch}_${path.basename(imageFile.path)}';
      final assetPath = path.join(assetsDir.path, fileName);
      
      await imageFile.copy(assetPath);
      
      // Return the relative path to use in the project
      return path.join(_assetsFolder, fileName);
    } catch (e) {
      print('Error saving image asset: $e');
      return 'assets/error.png';
    }
  }

  /// Get the absolute path for a project asset
  Future<String> getAbsoluteAssetPath(String projectId, String relativePath) async {
    if (kIsWeb) {
      // For prototype, just return the relative path
      return relativePath;
    }
    
    final appDir = await _appDocDir;
    return path.join(appDir.path, _projectsFolder, projectId, relativePath);
  }

  // Animations
  Future<List<Animation>> loadAnimations() async {
    final prefs = await SharedPreferences.getInstance();
    final animationsData = prefs.getStringList('animations') ?? [];
    
    return animationsData
        .map((data) => Animation.fromJson(json.decode(data)))
        .toList();
  }

  Future<void> saveAnimations(List<Animation> animations) async {
    final prefs = await SharedPreferences.getInstance();
    final animationsData = animations
        .map((animation) => json.encode(animation.toJson()))
        .toList();
    
    await prefs.setStringList('animations', animationsData);
  }
} 