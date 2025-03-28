import 'package:json_annotation/json_annotation.dart';
import 'package:uuid/uuid.dart';

part 'element_model.g.dart';

/// Base class for all canvas elements
@JsonSerializable(explicitToJson: true)
class CanvasElement {
  final String id;
  final String type;
  final Map<String, dynamic> properties;
  
  /// Optional reference to a forcefield if this element is attached to one
  final String? forcefieldId;
  
  CanvasElement({
    required this.id,
    required this.type,
    required this.properties,
    this.forcefieldId,
  });
  
  factory CanvasElement.create({
    required String type,
    required Map<String, dynamic> properties,
    String? forcefieldId,
  }) {
    return CanvasElement(
      id: const Uuid().v4(),
      type: type,
      properties: properties,
      forcefieldId: forcefieldId,
    );
  }
  
  factory CanvasElement.fromJson(Map<String, dynamic> json) =>
      _$CanvasElementFromJson(json);
  
  Map<String, dynamic> toJson() => _$CanvasElementToJson(this);
  
  CanvasElement copyWith({
    String? id,
    String? type,
    Map<String, dynamic>? properties,
    String? forcefieldId,
  }) {
    return CanvasElement(
      id: id ?? this.id,
      type: type ?? this.type,
      properties: properties ?? Map.from(this.properties),
      forcefieldId: forcefieldId ?? this.forcefieldId,
    );
  }
  
  /// Factory constructors for specific element types
  
  factory CanvasElement.shape({
    required String shape,
    required double x,
    required double y,
    required double width,
    required double height,
    required Map<String, dynamic> style,
  }) {
    return CanvasElement.create(
      type: 'shape',
      properties: {
        'shape': shape,
        'x': x,
        'y': y,
        'width': width,
        'height': height,
        'style': style,
      },
    );
  }
  
  factory CanvasElement.text({
    required String text,
    required double x,
    required double y,
    required Map<String, dynamic> style,
  }) {
    return CanvasElement.create(
      type: 'text',
      properties: {
        'text': text,
        'x': x,
        'y': y,
        'style': style,
      },
    );
  }
  
  factory CanvasElement.image({
    required String source,
    required double x,
    required double y,
    required double width,
    required double height,
  }) {
    return CanvasElement.create(
      type: 'image',
      properties: {
        'source': source,
        'x': x,
        'y': y,
        'width': width,
        'height': height,
      },
    );
  }
  
  factory CanvasElement.forcefield({
    required List<Map<String, double>> path,
    required String direction,
    required double speed,
    String? selectedAnimation,
  }) {
    return CanvasElement.create(
      type: 'forcefield',
      properties: {
        'path': path,
        'direction': direction, // 'forward' or 'reverse'
        'speed': speed,
        'selectedAnimation': selectedAnimation ?? 'linear',
      },
    );
  }
} 