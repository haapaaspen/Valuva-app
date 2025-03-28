// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'layer_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Layer _$LayerFromJson(Map<String, dynamic> json) => Layer(
      id: json['id'] as String,
      name: json['name'] as String,
      visible: json['visible'] as bool,
      locked: json['locked'] as bool,
      opacity: (json['opacity'] as num).toDouble(),
      elements: (json['elements'] as List<dynamic>)
          .map((e) => CanvasElement.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$LayerToJson(Layer instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'visible': instance.visible,
      'locked': instance.locked,
      'opacity': instance.opacity,
      'elements': instance.elements.map((e) => e.toJson()).toList(),
    };
