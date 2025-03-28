// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'animation_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Keyframe _$KeyframeFromJson(Map<String, dynamic> json) => Keyframe(
      time: (json['time'] as num).toInt(),
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$KeyframeToJson(Keyframe instance) => <String, dynamic>{
      'time': instance.time,
      'value': instance.value,
    };

Animation _$AnimationFromJson(Map<String, dynamic> json) => Animation(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      duration: (json['duration'] as num).toInt(),
      keyframes: (json['keyframes'] as List<dynamic>)
          .map((e) => Keyframe.fromJson(e as Map<String, dynamic>))
          .toList(),
      sourceElementId: json['sourceElementId'] as String?,
      targetElementId: json['targetElementId'] as String?,
    );

Map<String, dynamic> _$AnimationToJson(Animation instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'duration': instance.duration,
      'keyframes': instance.keyframes.map((e) => e.toJson()).toList(),
      'sourceElementId': instance.sourceElementId,
      'targetElementId': instance.targetElementId,
    };
