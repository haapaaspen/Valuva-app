// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Project _$ProjectFromJson(Map<String, dynamic> json) => Project(
      id: json['id'] as String,
      name: json['name'] as String,
      created: json['created'] as String,
      modified: json['modified'] as String,
      canvasWidth: (json['canvasWidth'] as num).toDouble(),
      canvasHeight: (json['canvasHeight'] as num).toDouble(),
      layerOrder: (json['layerOrder'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      activeLayerId: json['activeLayerId'] as String,
      layers: (json['layers'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, Layer.fromJson(e as Map<String, dynamic>)),
      ),
    );

Map<String, dynamic> _$ProjectToJson(Project instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'created': instance.created,
      'modified': instance.modified,
      'canvasWidth': instance.canvasWidth,
      'canvasHeight': instance.canvasHeight,
      'layerOrder': instance.layerOrder,
      'activeLayerId': instance.activeLayerId,
      'layers': instance.layers.map((k, e) => MapEntry(k, e.toJson())),
    };
