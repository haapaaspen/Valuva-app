import 'package:uuid/uuid.dart';
import './canvas_element.dart';

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
    this.visible = true,
    this.locked = false,
    this.opacity = 1.0,
    this.elements = const [],
  });

  // Methods
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
      elements: elements ?? this.elements,
    );
  }

  // Add an element to the layer
  Layer addElement(CanvasElement element) {
    final updatedElements = List<CanvasElement>.from(elements)..add(element);
    return copyWith(elements: updatedElements);
  }

  // Update an element in the layer
  Layer updateElement(CanvasElement updatedElement) {
    final updatedElements = elements.map((element) {
      return element.id == updatedElement.id ? updatedElement : element;
    }).toList();
    
    return copyWith(elements: updatedElements);
  }

  // Remove an element from the layer
  Layer removeElement(String elementId) {
    final updatedElements = elements.where((element) => element.id != elementId).toList();
    return copyWith(elements: updatedElements);
  }

  // Factory constructor for creating a new layer
  factory Layer.create({required String name}) {
    return Layer(
      id: const Uuid().v4(),
      name: name,
    );
  }

  // From JSON
  factory Layer.fromJson(Map<String, dynamic> json) {
    return Layer(
      id: json['id'] as String,
      name: json['name'] as String,
      visible: json['visible'] as bool? ?? true,
      locked: json['locked'] as bool? ?? false,
      opacity: (json['opacity'] as num?)?.toDouble() ?? 1.0,
      elements: (json['elements'] as List<dynamic>?)
              ?.map((e) => CanvasElement.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  // To JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'visible': visible,
      'locked': locked,
      'opacity': opacity,
      'elements': elements.map((e) => e.toJson()).toList(),
    };
  }
} 