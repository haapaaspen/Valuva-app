import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

enum ElementType {
  shape,
  text,
  image,
  forcefield,
}

class CanvasElement {
  final String id;
  final ElementType type;
  final double x;
  final double y;
  final double width;
  final double height;
  final double rotation;
  final Map<String, dynamic> properties;

  CanvasElement({
    required this.id,
    required this.type,
    required this.x,
    required this.y,
    required this.width,
    required this.height,
    this.rotation = 0.0,
    this.properties = const {},
  });

  // Methods
  CanvasElement copyWith({
    String? id,
    ElementType? type,
    double? x,
    double? y,
    double? width,
    double? height,
    double? rotation,
    Map<String, dynamic>? properties,
  }) {
    return CanvasElement(
      id: id ?? this.id,
      type: type ?? this.type,
      x: x ?? this.x,
      y: y ?? this.y,
      width: width ?? this.width,
      height: height ?? this.height,
      rotation: rotation ?? this.rotation,
      properties: properties ?? {...this.properties},
    );
  }

  // Factory constructors for different element types
  factory CanvasElement.shape({
    String? id,
    required double x,
    required double y,
    required double width,
    required double height,
    String shape = 'rectangle',
    Color fillColor = Colors.blue,
    Color strokeColor = Colors.black,
    double strokeWidth = 1.0,
    double rotation = 0.0,
  }) {
    return CanvasElement(
      id: id ?? const Uuid().v4(),
      type: ElementType.shape,
      x: x,
      y: y,
      width: width,
      height: height,
      rotation: rotation,
      properties: {
        'shape': shape,
        'fillColor': fillColor.value,
        'strokeColor': strokeColor.value,
        'strokeWidth': strokeWidth,
      },
    );
  }

  factory CanvasElement.text({
    String? id,
    required double x,
    required double y,
    required double width,
    required double height,
    String text = 'Text',
    String fontFamily = 'Roboto',
    double fontSize = 16.0,
    FontWeight fontWeight = FontWeight.normal,
    Color color = Colors.black,
    TextAlign textAlign = TextAlign.left,
    double rotation = 0.0,
  }) {
    return CanvasElement(
      id: id ?? const Uuid().v4(),
      type: ElementType.text,
      x: x,
      y: y,
      width: width,
      height: height,
      rotation: rotation,
      properties: {
        'text': text,
        'fontFamily': fontFamily,
        'fontSize': fontSize,
        'fontWeight': fontWeight.index,
        'color': color.value,
        'textAlign': textAlign.index,
      },
    );
  }

  factory CanvasElement.image({
    String? id,
    required double x,
    required double y,
    required double width,
    required double height,
    required String source,
    double rotation = 0.0,
  }) {
    return CanvasElement(
      id: id ?? const Uuid().v4(),
      type: ElementType.image,
      x: x,
      y: y,
      width: width,
      height: height,
      rotation: rotation,
      properties: {
        'source': source,
      },
    );
  }

  factory CanvasElement.forcefield({
    String? id,
    required double x,
    required double y,
    required double width,
    required double height,
    String animationId = '',
    double strength = 1.0,
    double radius = 100.0,
    String shape = 'circle',
    double rotation = 0.0,
  }) {
    return CanvasElement(
      id: id ?? const Uuid().v4(),
      type: ElementType.forcefield,
      x: x,
      y: y,
      width: width,
      height: height,
      rotation: rotation,
      properties: {
        'animationId': animationId,
        'strength': strength,
        'radius': radius,
        'shape': shape,
      },
    );
  }

  // From JSON
  factory CanvasElement.fromJson(Map<String, dynamic> json) {
    return CanvasElement(
      id: json['id'] as String,
      type: ElementType.values[json['type'] as int],
      x: (json['x'] as num).toDouble(),
      y: (json['y'] as num).toDouble(),
      width: (json['width'] as num).toDouble(),
      height: (json['height'] as num).toDouble(),
      rotation: (json['rotation'] as num?)?.toDouble() ?? 0.0,
      properties: json['properties'] as Map<String, dynamic>? ?? {},
    );
  }

  // To JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type.index,
      'x': x,
      'y': y,
      'width': width,
      'height': height,
      'rotation': rotation,
      'properties': properties,
    };
  }
} 