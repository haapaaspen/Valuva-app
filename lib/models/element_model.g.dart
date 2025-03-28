// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'element_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CanvasElement _$CanvasElementFromJson(Map<String, dynamic> json) =>
    CanvasElement(
      id: json['id'] as String,
      type: json['type'] as String,
      properties: json['properties'] as Map<String, dynamic>,
      forcefieldId: json['forcefieldId'] as String?,
    );

Map<String, dynamic> _$CanvasElementToJson(CanvasElement instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'properties': instance.properties,
      'forcefieldId': instance.forcefieldId,
    };
