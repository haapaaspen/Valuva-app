import 'package:json_annotation/json_annotation.dart';
import 'package:uuid/uuid.dart';

part 'animation_model.g.dart';

/// Represents a keyframe in an animation
@JsonSerializable()
class Keyframe {
  final int time;   // Time in milliseconds
  final double value; // Progress value (0.0 to 1.0)
  
  Keyframe({
    required this.time,
    required this.value,
  });
  
  factory Keyframe.fromJson(Map<String, dynamic> json) => _$KeyframeFromJson(json);
  Map<String, dynamic> toJson() => _$KeyframeToJson(this);
}

/// Represents an animation for a forcefield
@JsonSerializable(explicitToJson: true)
class Animation {
  final String id;
  final String name;
  final String type; // 'linear', 'recorded', 'custom'
  final int duration; // in milliseconds
  final List<Keyframe> keyframes;
  final String? sourceElementId; // ID of the element that initiates the animation (forcefield)
  final String? targetElementId; // ID of the element being animated
  
  Animation({
    required this.id,
    required this.name,
    required this.type,
    required this.duration,
    required this.keyframes,
    this.sourceElementId,
    this.targetElementId,
  });
  
  /// Create a new linear animation
  factory Animation.linear({
    String? id,
    String? name,
    int duration = 5000,
    String? sourceElementId,
    String? targetElementId,
  }) {
    return Animation(
      id: id ?? const Uuid().v4(),
      name: name ?? 'Linear',
      type: 'linear',
      duration: duration,
      keyframes: [
        Keyframe(time: 0, value: 0.0),
        Keyframe(time: duration, value: 1.0),
      ],
      sourceElementId: sourceElementId,
      targetElementId: targetElementId,
    );
  }
  
  /// Create a new animation from recorded keyframes
  factory Animation.recorded({
    required String name,
    required List<Keyframe> keyframes,
    String? id,
    String? sourceElementId,
    String? targetElementId,
  }) {
    // Ensure keyframes are sorted by time
    final sortedKeyframes = List<Keyframe>.from(keyframes)
      ..sort((a, b) => a.time.compareTo(b.time));
    
    // Calculate total duration
    final duration = sortedKeyframes.isNotEmpty 
      ? sortedKeyframes.last.time 
      : 5000;
    
    return Animation(
      id: id ?? const Uuid().v4(),
      name: name,
      type: 'recorded',
      duration: duration,
      keyframes: sortedKeyframes,
      sourceElementId: sourceElementId,
      targetElementId: targetElementId,
    );
  }
  
  /// Get animation value at a specific time
  double getValueAtTime(int time) {
    // If time is outside the duration, clamp it
    if (time <= 0) return 0.0;
    if (time >= duration) return 1.0;
    
    // Find the keyframes between which this time falls
    Keyframe? before;
    Keyframe? after;
    
    for (int i = 0; i < keyframes.length; i++) {
      if (keyframes[i].time > time) {
        if (i > 0) {
          before = keyframes[i - 1];
        }
        after = keyframes[i];
        break;
      }
    }
    
    // If we didn't find a keyframe after this time, use the last keyframe
    if (after == null && keyframes.isNotEmpty) {
      return keyframes.last.value;
    }
    
    // If we didn't find a keyframe before this time, use the first keyframe
    if (before == null && keyframes.isNotEmpty) {
      return keyframes.first.value;
    }
    
    // If we have both before and after, interpolate between them
    if (before != null && after != null) {
      final timeDiff = after.time - before.time;
      final valueDiff = after.value - before.value;
      final ratio = (time - before.time) / timeDiff;
      return before.value + (valueDiff * ratio);
    }
    
    // Default fallback
    return 0.0;
  }
  
  factory Animation.fromJson(Map<String, dynamic> json) => _$AnimationFromJson(json);
  Map<String, dynamic> toJson() => _$AnimationToJson(this);
} 