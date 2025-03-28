import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'package:valuva/models/models.dart';
import 'package:valuva/services/storage_service.dart';

class ProjectProvider extends ChangeNotifier {
  final StorageService _storageService = StorageService();
  Project? _currentProject;
  List<Project>? _projects;
  bool _isLoading = false;
  String? _error;

  // Getters
  Project? get currentProject => _currentProject;
  List<Project> get projects => _projects ?? [];
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasProject => _currentProject != null;

  // Initialize and load projects
  Future<void> initialize() async {
    _setLoading(true);
    try {
      await loadProjects();
      _setError(null);
    } catch (e) {
      _setError('Failed to initialize: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Load all projects
  Future<void> loadProjects() async {
    _setLoading(true);
    try {
      _projects = await _storageService.listProjects();
      _setError(null);
    } catch (e) {
      _setError('Failed to load projects: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Create a new project
  Future<void> createProject(String name) async {
    _setLoading(true);
    try {
      final newProject = Project.create(name: name);
      await _storageService.saveProject(newProject);
      await loadProjects();
      _currentProject = newProject;
      _setError(null);
    } catch (e) {
      _setError('Failed to create project: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Load a specific project
  Future<void> loadProject(String projectId) async {
    _setLoading(true);
    try {
      final project = await _storageService.loadProject(projectId);
      _currentProject = project;
      _setError(null);
    } catch (e) {
      _setError('Failed to load project: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Save the current project
  Future<void> saveCurrentProject() async {
    if (_currentProject == null) return;
    
    _setLoading(true);
    try {
      // Update the modified date to now
      _currentProject = _currentProject!.copyWith(
        modified: DateTime.now().toIso8601String(),
      );
      
      await _storageService.saveProject(_currentProject!);
      await loadProjects(); // Refresh the projects list
      _setError(null);
    } catch (e) {
      _setError('Failed to save project: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Save a specific project
  Future<void> saveProject(Project project) async {
    _setLoading(true);
    try {
      await _storageService.saveProject(project);
      
      // If this is the current project, update it
      if (_currentProject?.id == project.id) {
        _currentProject = project;
      }
      
      await loadProjects(); // Refresh the projects list
      _setError(null);
    } catch (e) {
      _setError('Failed to save project: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Delete a project
  Future<void> deleteProject(String projectId) async {
    _setLoading(true);
    try {
      await _storageService.deleteProject(projectId);
      
      // If the current project was deleted, clear it
      if (_currentProject?.id == projectId) {
        _currentProject = null;
      }
      
      await loadProjects(); // Refresh the projects list
      _setError(null);
    } catch (e) {
      _setError('Failed to delete project: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Close the current project
  void closeCurrentProject() {
    _currentProject = null;
    notifyListeners();
  }

  // Add a new layer to the current project
  Future<void> addLayer(String name) async {
    if (_currentProject == null) return;
    
    _currentProject = _currentProject!.addLayer(name);
    await saveCurrentProject();
    notifyListeners();
  }

  // Delete a layer from the current project
  Future<void> deleteLayer(String layerId) async {
    if (_currentProject == null) return;
    
    _currentProject = _currentProject!.deleteLayer(layerId);
    await saveCurrentProject();
    notifyListeners();
  }

  // Set the active layer
  Future<void> setActiveLayer(String layerId) async {
    if (_currentProject == null) return;
    
    _currentProject = _currentProject!.setActiveLayer(layerId);
    await saveCurrentProject();
    notifyListeners();
  }

  // Reorder layers
  Future<void> reorderLayers(List<String> newLayerOrder) async {
    if (_currentProject == null) return;
    
    _currentProject = _currentProject!.reorderLayers(newLayerOrder);
    await saveCurrentProject();
    notifyListeners();
  }

  // Update a layer in the project
  Future<void> updateLayer(Layer updatedLayer) async {
    if (_currentProject == null) return;
    
    _currentProject = _currentProject!.updateLayer(updatedLayer);
    await saveCurrentProject();
    notifyListeners();
  }

  // Add an element to the active layer
  Future<void> addElement(CanvasElement element) async {
    if (_currentProject == null || _currentProject!.activeLayer == null) return;
    
    final activeLayer = _currentProject!.activeLayer!;
    final updatedLayer = activeLayer.addElement(element);
    
    _currentProject = _currentProject!.updateLayer(updatedLayer);
    await saveCurrentProject();
    notifyListeners();
  }

  // Update an element in the active layer
  Future<void> updateElement(CanvasElement updatedElement) async {
    if (_currentProject == null || _currentProject!.activeLayer == null) return;
    
    final activeLayer = _currentProject!.activeLayer!;
    final updatedLayer = activeLayer.updateElement(updatedElement);
    
    _currentProject = _currentProject!.updateLayer(updatedLayer);
    await saveCurrentProject();
    notifyListeners();
  }

  // Delete an element from the active layer
  Future<void> deleteElement(String elementId) async {
    if (_currentProject == null || _currentProject!.activeLayer == null) return;
    
    final activeLayer = _currentProject!.activeLayer!;
    final updatedLayer = activeLayer.removeElement(elementId);
    
    _currentProject = _currentProject!.updateLayer(updatedLayer);
    await saveCurrentProject();
    notifyListeners();
  }

  // Add an image element to the active layer
  Future<void> addImageElement({
    required double x,
    required double y,
    required double width,
    required double height,
    required ImageSource source,
  }) async {
    if (_currentProject == null || _currentProject!.activeLayer == null) return;
    
    try {
      _setLoading(true);
      
      // Use image_picker to get the image
      final imagePicker = ImagePicker();
      final pickedFile = await imagePicker.pickImage(source: source);
      
      if (pickedFile == null) {
        _setLoading(false);
        return;
      }
      
      // Save the image to the project assets folder
      final imageFile = File(pickedFile.path);
      final relativePath = await _storageService.saveImageAsset(
        _currentProject!.id, 
        imageFile
      );
      
      // Create and add the image element
      final element = CanvasElement.image(
        source: relativePath,
        x: x,
        y: y,
        width: width,
        height: height,
      );
      
      await addElement(element);
      
    } catch (e) {
      _setError('Failed to add image: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Create a project in memory only (for prototype purposes)
  Future<void> createProjectInMemory(Project project) async {
    _currentProject = project;
    notifyListeners();
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? errorMessage) {
    _error = errorMessage;
    notifyListeners();
  }
} 