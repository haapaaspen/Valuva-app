import 'dart:convert';
import 'package:json_annotation/json_annotation.dart';
import 'package:uuid/uuid.dart';

import 'layer_model.dart';

part 'project_model.g.dart';

@JsonSerializable(explicitToJson: true)
class Project {
  final String id;
  final String name;
  final String created;
  final String modified;
  final double canvasWidth;
  final double canvasHeight;
  final List<String> layerOrder;
  final String activeLayerId;
  final Map<String, Layer> layers;

  Project({
    required this.id,
    required this.name,
    required this.created,
    required this.modified,
    required this.canvasWidth,
    required this.canvasHeight,
    required this.layerOrder,
    required this.activeLayerId,
    required this.layers,
  });

  /// Get the active layer
  Layer? get activeLayer => layers[activeLayerId];

  /// Width getter for backwards compatibility
  double get width => canvasWidth;
  
  /// Height getter for backwards compatibility
  double get height => canvasHeight;

  /// Create a new empty project with default settings
  factory Project.create({required String name}) {
    final now = DateTime.now().toIso8601String();
    final id = const Uuid().v4();
    
    // Create a default layer
    final defaultLayerId = const Uuid().v4();
    final defaultLayer = Layer.create(name: 'Layer 1', id: defaultLayerId);
    
    return Project(
      id: id,
      name: name,
      created: now,
      modified: now,
      canvasWidth: 1080,  // Mobile portrait default
      canvasHeight: 1920, // Mobile portrait default
      layerOrder: [defaultLayerId],
      activeLayerId: defaultLayerId,
      layers: {defaultLayerId: defaultLayer},
    );
  }

  /// Create a project from JSON
  factory Project.fromJson(Map<String, dynamic> json) => _$ProjectFromJson(json);

  /// Convert project to JSON
  Map<String, dynamic> toJson() => _$ProjectToJson(this);

  /// Helper method to convert to and from a string
  String toJsonString() => jsonEncode(toJson());
  
  /// Create a project from a JSON string
  factory Project.fromJsonString(String jsonString) => 
      Project.fromJson(jsonDecode(jsonString) as Map<String, dynamic>);
      
  /// Create a copy of this project with optional new values
  Project copyWith({
    String? id,
    String? name,
    String? created,
    String? modified,
    double? canvasWidth,
    double? canvasHeight,
    double? width,
    double? height,
    List<String>? layerOrder,
    String? activeLayerId,
    Map<String, Layer>? layers,
  }) {
    return Project(
      id: id ?? this.id,
      name: name ?? this.name,
      created: created ?? this.created,
      modified: modified ?? DateTime.now().toIso8601String(),
      canvasWidth: width ?? canvasWidth ?? this.canvasWidth,
      canvasHeight: height ?? canvasHeight ?? this.canvasHeight,
      layerOrder: layerOrder ?? List.from(this.layerOrder),
      activeLayerId: activeLayerId ?? this.activeLayerId,
      layers: layers ?? Map.from(this.layers),
    );
  }
  
  /// Add a new layer to the project
  Project addLayer(String layerName) {
    final newLayerId = const Uuid().v4();
    final newLayer = Layer.create(name: layerName, id: newLayerId);
    
    final updatedLayers = Map<String, Layer>.from(layers);
    updatedLayers[newLayerId] = newLayer;
    
    final updatedLayerOrder = List<String>.from(layerOrder)..add(newLayerId);
    
    return copyWith(
      layers: updatedLayers,
      layerOrder: updatedLayerOrder,
      activeLayerId: newLayerId,
    );
  }
  
  /// Delete a layer from the project
  Project deleteLayer(String layerId) {
    if (layers.length <= 1) {
      // Don't delete the last layer
      return this;
    }
    
    final updatedLayers = Map<String, Layer>.from(layers)..remove(layerId);
    final updatedLayerOrder = List<String>.from(layerOrder)..remove(layerId);
    
    // If the active layer was deleted, set a new active layer
    String updatedActiveLayerId = activeLayerId;
    if (activeLayerId == layerId) {
      updatedActiveLayerId = updatedLayerOrder.first;
    }
    
    return copyWith(
      layers: updatedLayers,
      layerOrder: updatedLayerOrder,
      activeLayerId: updatedActiveLayerId,
    );
  }
  
  /// Update a layer in the project
  Project updateLayer(Layer updatedLayer) {
    final updatedLayers = Map<String, Layer>.from(layers);
    updatedLayers[updatedLayer.id] = updatedLayer;
    
    return copyWith(layers: updatedLayers);
  }
  
  /// Set the active layer
  Project setActiveLayer(String layerId) {
    if (!layers.containsKey(layerId)) {
      return this;
    }
    
    return copyWith(activeLayerId: layerId);
  }
  
  /// Reorder layers
  Project reorderLayers(List<String> newLayerOrder) {
    // Ensure all layers are still represented
    if (newLayerOrder.length != layerOrder.length ||
        !newLayerOrder.every((id) => layers.containsKey(id))) {
      return this;
    }
    
    return copyWith(layerOrder: newLayerOrder);
  }
} 