import 'package:uuid/uuid.dart';

import 'layer.dart';

class Project {
  final String id;
  final String name;
  final String created;
  final String modified;
  final int width;
  final int height;
  final Map<String, Layer> layers;
  final List<String> layerOrder;
  final String activeLayerId;

  Project({
    required this.id,
    required this.name,
    required this.created,
    required this.modified,
    this.width = 1920,
    this.height = 1080,
    this.layers = const {},
    this.layerOrder = const [],
    this.activeLayerId = '',
  });

  // Get the active layer
  Layer? get activeLayer => 
    activeLayerId.isNotEmpty ? layers[activeLayerId] : null;

  // Methods
  Project copyWith({
    String? id,
    String? name,
    String? created,
    String? modified,
    int? width,
    int? height,
    Map<String, Layer>? layers,
    List<String>? layerOrder,
    String? activeLayerId,
  }) {
    return Project(
      id: id ?? this.id,
      name: name ?? this.name,
      created: created ?? this.created,
      modified: modified ?? this.modified,
      width: width ?? this.width,
      height: height ?? this.height,
      layers: layers ?? {...this.layers},
      layerOrder: layerOrder ?? [...this.layerOrder],
      activeLayerId: activeLayerId ?? this.activeLayerId,
    );
  }

  // Add a new layer
  Project addLayer(String name) {
    final newLayer = Layer.create(name: name);
    final updatedLayers = {...layers};
    updatedLayers[newLayer.id] = newLayer;
    
    final updatedLayerOrder = [...layerOrder, newLayer.id];
    
    return copyWith(
      layers: updatedLayers,
      layerOrder: updatedLayerOrder,
      activeLayerId: newLayer.id,
      modified: DateTime.now().toIso8601String(),
    );
  }

  // Delete a layer
  Project deleteLayer(String layerId) {
    if (layers.length <= 1) {
      return this; // Don't delete the only layer
    }
    
    final updatedLayers = {...layers};
    updatedLayers.remove(layerId);
    
    final updatedLayerOrder = [...layerOrder];
    updatedLayerOrder.remove(layerId);
    
    String newActiveLayerId = activeLayerId;
    if (activeLayerId == layerId) {
      newActiveLayerId = updatedLayerOrder.isNotEmpty ? updatedLayerOrder.first : '';
    }
    
    return copyWith(
      layers: updatedLayers,
      layerOrder: updatedLayerOrder,
      activeLayerId: newActiveLayerId,
      modified: DateTime.now().toIso8601String(),
    );
  }

  // Set the active layer
  Project setActiveLayer(String layerId) {
    if (!layers.containsKey(layerId)) {
      return this;
    }
    
    return copyWith(
      activeLayerId: layerId,
      modified: DateTime.now().toIso8601String(),
    );
  }

  // Reorder layers
  Project reorderLayers(List<String> newLayerOrder) {
    return copyWith(
      layerOrder: newLayerOrder,
      modified: DateTime.now().toIso8601String(),
    );
  }

  // Update a layer in the project
  Project updateLayer(Layer updatedLayer) {
    final updatedLayers = {...layers};
    updatedLayers[updatedLayer.id] = updatedLayer;
    
    return copyWith(
      layers: updatedLayers,
      modified: DateTime.now().toIso8601String(),
    );
  }

  // Factory constructor for creating a new project
  factory Project.create({required String name}) {
    final id = const Uuid().v4();
    final now = DateTime.now().toIso8601String();
    
    // Create a project with one default layer
    final defaultLayer = Layer.create(name: 'Background');
    
    final Map<String, Layer> layers = {defaultLayer.id: defaultLayer};
    final layerOrder = [defaultLayer.id];
    
    return Project(
      id: id,
      name: name,
      created: now,
      modified: now,
      layers: layers,
      layerOrder: layerOrder,
      activeLayerId: defaultLayer.id,
    );
  }

  // From JSON
  factory Project.fromJson(Map<String, dynamic> json) {
    final layersData = json['layers'] as Map<String, dynamic>? ?? {};
    final Map<String, Layer> layers = {};
    
    layersData.forEach((key, value) {
      layers[key] = Layer.fromJson(value as Map<String, dynamic>);
    });
    
    return Project(
      id: json['id'] as String,
      name: json['name'] as String,
      created: json['created'] as String,
      modified: json['modified'] as String,
      width: json['width'] as int? ?? 1920,
      height: json['height'] as int? ?? 1080,
      layers: layers,
      layerOrder: (json['layerOrder'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      activeLayerId: json['activeLayerId'] as String? ?? '',
    );
  }

  // To JSON
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> layersData = {};
    
    layers.forEach((key, layer) {
      layersData[key] = layer.toJson();
    });
    
    return {
      'id': id,
      'name': name,
      'created': created,
      'modified': modified,
      'width': width,
      'height': height,
      'layers': layersData,
      'layerOrder': layerOrder,
      'activeLayerId': activeLayerId,
    };
  }
} 