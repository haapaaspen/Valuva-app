import 'package:json_annotation/json_annotation.dart';
import 'package:uuid/uuid.dart';
import 'element_model.dart';

part 'layer_model.g.dart';

@JsonSerializable(explicitToJson: true)
class Layer {
  final String id;
  final String name;
  final bool visible;
  final bool locked;
  final double opacity;
  final List<CanvasElement> elements;

  Layer({
    required this.id,
    required this.name,
    required this.visible,
    required this.locked,
    required this.opacity,
    required this.elements,
  });

  /// Create a new empty layer with default settings
  factory Layer.create({required String name, String? id}) {
    return Layer(
      id: id ?? const Uuid().v4(),
      name: name,
      visible: true,
      locked: false,
      opacity: 1.0,
      elements: [],
    );
  }

  /// Create a layer from JSON
  factory Layer.fromJson(Map<String, dynamic> json) => _$LayerFromJson(json);

  /// Convert layer to JSON
  Map<String, dynamic> toJson() => _$LayerToJson(this);

  /// Create a copy of this layer with optional new values
  Layer copyWith({
    String? id,
    String? name,
    bool? visible,
    bool? locked,
    double? opacity,
    List<CanvasElement>? elements,
  }) {
    return Layer(
      id: id ?? this.id,
      name: name ?? this.name,
      visible: visible ?? this.visible,
      locked: locked ?? this.locked,
      opacity: opacity ?? this.opacity,
      elements: elements ?? List.from(this.elements),
    );
  }

  /// Add an element to this layer
  Layer addElement(CanvasElement element) {
    final newElements = List<CanvasElement>.from(elements)..add(element);
    return copyWith(elements: newElements);
  }

  /// Remove an element from this layer
  Layer removeElement(String elementId) {
    final newElements = elements.where((e) => e.id != elementId).toList();
    return copyWith(elements: newElements);
  }

  /// Update an element in this layer
  Layer updateElement(CanvasElement updatedElement) {
    final newElements = elements.map((e) {
      return e.id == updatedElement.id ? updatedElement : e;
    }).toList();
    return copyWith(elements: newElements);
  }

  /// Get an element by ID
  CanvasElement? getElementById(String elementId) {
    final element = elements.where((e) => e.id == elementId).firstOrNull;
    return element;
  }
} 