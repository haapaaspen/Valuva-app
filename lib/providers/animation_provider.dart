import 'dart:collection';
import 'package:flutter/material.dart';

import 'package:valuva/models/animation_model.dart' as animation_model;
import 'package:valuva/services/storage_service.dart';

class AnimationProvider extends ChangeNotifier {
  final StorageService _storageService = StorageService();
  
  // Animation state
  bool _isPlaying = false;
  bool _isRecording = false;
  int _currentFrame = 0;
  int _duration = 5000; // Default 5 seconds
  
  // Active animations
  final Map<String, animation_model.Animation> _animations = {};
  String _activeAnimationId = '';
  
  // Getters
  bool get isPlaying => _isPlaying;
  bool get isRecording => _isRecording;
  int get currentFrame => _currentFrame;
  int get duration => _duration;
  String get activeAnimationId => _activeAnimationId;
  animation_model.Animation? get activeAnimation => 
      _activeAnimationId.isNotEmpty ? _animations[_activeAnimationId] : null;
  UnmodifiableMapView<String, animation_model.Animation> get animations => 
      UnmodifiableMapView(_animations);
  
  // Global animation progress (0.0 to 1.0)
  double get globalProgress => _currentFrame / (_duration > 0 ? _duration : 1);
  
  // Initialize
  void initialize() {
    // Add default linear animation
    final linearAnimation = animation_model.Animation.linear();
    _animations[linearAnimation.id] = linearAnimation;
    _activeAnimationId = linearAnimation.id;
    
    // Load saved animations
    loadAnimations();
  }
  
  // Load animations from storage
  Future<void> loadAnimations() async {
    try {
      final animations = await _storageService.loadAnimations();
      for (final animation in animations) {
        _animations[animation.id] = animation;
      }
      notifyListeners();
    } catch (e) {
      print('Error loading animations: $e');
    }
  }
  
  // Save animations to storage
  Future<void> saveAnimations() async {
    try {
      await _storageService.saveAnimations(_animations.values.toList());
    } catch (e) {
      print('Error saving animations: $e');
    }
  }
  
  // Set active animation
  void setActiveAnimation(String animationId) {
    if (_animations.containsKey(animationId)) {
      _activeAnimationId = animationId;
      notifyListeners();
    }
  }
  
  // Add or update animation
  void addAnimation(animation_model.Animation animation) {
    _animations[animation.id] = animation;
    saveAnimations();
    notifyListeners();
  }
  
  // Delete animation
  void deleteAnimation(String animationId) {
    if (_animations.containsKey(animationId)) {
      _animations.remove(animationId);
      
      // If the active animation was deleted, set another one as active
      if (_activeAnimationId == animationId) {
        _activeAnimationId = _animations.isNotEmpty ? _animations.keys.first : '';
      }
      
      saveAnimations();
      notifyListeners();
    }
  }
  
  // Playback controls
  void play() {
    _isPlaying = true;
    notifyListeners();
  }
  
  void pause() {
    _isPlaying = false;
    notifyListeners();
  }
  
  void stop() {
    _isPlaying = false;
    _currentFrame = 0;
    notifyListeners();
  }
  
  void seek(int frame) {
    _currentFrame = frame;
    notifyListeners();
  }
  
  // Recording controls
  void startRecording() {
    _isRecording = true;
    notifyListeners();
  }
  
  void stopRecording() {
    _isRecording = false;
    notifyListeners();
  }
  
  // Update duration
  void setDuration(int milliseconds) {
    _duration = milliseconds;
    notifyListeners();
  }
  
  // Get animation by ID
  animation_model.Animation? getAnimationById(String animationId) {
    return _animations[animationId];
  }
  
  // Get animations for a specific forcefield
  List<animation_model.Animation> getAnimationsForForcefield(String forcefieldId) {
    return _animations.values
        .where((animation) => 
            animation.targetElementId == forcefieldId || 
            animation.sourceElementId == forcefieldId)
        .toList();
  }
  
  // Global animation controls
  void setGlobalProgress(double progress) {
    _currentFrame = (progress * _duration).round();
    notifyListeners();
  }
  
  void playGlobal() {
    _isPlaying = true;
    notifyListeners();
  }
  
  void pauseGlobal() {
    _isPlaying = false;
    notifyListeners();
  }
  
  void stopGlobal() {
    _isPlaying = false;
    _currentFrame = 0;
    notifyListeners();
  }
  
  // Global recording
  void startGlobalRecording() {
    _isRecording = true;
    notifyListeners();
  }
  
  void stopGlobalRecording() {
    _isRecording = false;
    notifyListeners();
  }
} 