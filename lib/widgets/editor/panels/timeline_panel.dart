import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';

class TimelinePanel extends StatelessWidget {
  const TimelinePanel({super.key});

  @override
  Widget build(BuildContext context) {
    final animationProvider = Provider.of<AnimationProvider>(context);
    
    return Container(
      color: AppTheme.surfaceColor,
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Timeline header
          Row(
            children: [
              Text(
                'Timeline',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const Spacer(),
              _buildTimeDisplay(context, animationProvider),
              const SizedBox(width: 16),
              _buildPlaybackControls(context, animationProvider),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Main timeline slider
          Expanded(
            child: Row(
              children: [
                // Record button
                _buildRecordButton(context, animationProvider),
                const SizedBox(width: 16),
                
                // Timeline slider
                Expanded(
                  child: Slider(
                    value: animationProvider.globalProgress,
                    onChanged: (value) => animationProvider.setGlobalProgress(value),
                    activeColor: AppTheme.primaryColor,
                    inactiveColor: AppTheme.primaryColor.withOpacity(0.3),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTimeDisplay(BuildContext context, AnimationProvider animationProvider) {
    final currentTimeMs = (animationProvider.globalProgress * animationProvider.duration).toInt();
    final seconds = (currentTimeMs / 1000).floor();
    final milliseconds = currentTimeMs % 1000;
    
    return Text(
      '${seconds.toString().padLeft(2, '0')}.${(milliseconds ~/ 10).toString().padLeft(2, '0')} / ${(animationProvider.duration / 1000).toStringAsFixed(2)}s',
      style: Theme.of(context).textTheme.bodyMedium,
    );
  }
  
  Widget _buildPlaybackControls(BuildContext context, AnimationProvider animationProvider) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: const Icon(Icons.skip_previous),
          onPressed: () => animationProvider.setGlobalProgress(0),
          tooltip: 'Go to Start',
        ),
        IconButton(
          icon: Icon(
            animationProvider.isPlaying ? Icons.pause : Icons.play_arrow,
          ),
          onPressed: () {
            if (animationProvider.isPlaying) {
              animationProvider.pauseGlobal();
            } else {
              animationProvider.playGlobal();
            }
          },
          tooltip: animationProvider.isPlaying ? 'Pause' : 'Play',
        ),
        IconButton(
          icon: const Icon(Icons.stop),
          onPressed: () => animationProvider.stopGlobal(),
          tooltip: 'Stop',
        ),
        IconButton(
          icon: const Icon(Icons.skip_next),
          onPressed: () => animationProvider.setGlobalProgress(1.0),
          tooltip: 'Go to End',
        ),
      ],
    );
  }
  
  Widget _buildRecordButton(BuildContext context, AnimationProvider animationProvider) {
    return Tooltip(
      message: animationProvider.isRecording ? 'Stop Recording' : 'Start Recording',
      child: GestureDetector(
        onTap: () {
          if (animationProvider.isRecording) {
            _stopRecording(context, animationProvider);
          } else {
            animationProvider.startGlobalRecording();
          }
        },
        child: Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: animationProvider.isRecording
                ? Colors.red
                : Colors.red[800],
            border: Border.all(
              color: Colors.white,
              width: 2,
            ),
          ),
          child: animationProvider.isRecording
              ? const Icon(Icons.stop, size: 16, color: Colors.white)
              : const Icon(Icons.fiber_manual_record, size: 16, color: Colors.white),
        ),
      ),
    );
  }
  
  void _stopRecording(BuildContext context, AnimationProvider animationProvider) {
    final TextEditingController nameController = TextEditingController(text: 'Animation ${DateTime.now().millisecondsSinceEpoch}');
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Save Recording'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Enter a name for your animation recording:'),
            const SizedBox(height: 16),
            TextField(
              controller: nameController,
              autofocus: true,
              decoration: const InputDecoration(
                labelText: 'Animation Name',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              // Discard recording
              animationProvider.stopGlobalRecording();
              Navigator.pop(context);
            },
            child: const Text('Discard'),
          ),
          ElevatedButton(
            onPressed: () {
              final name = nameController.text.trim();
              if (name.isNotEmpty) {
                animationProvider.stopGlobalRecording();
                // Save the animation with a name
                // TODO: Create and save the animation with the recorded data
                Navigator.pop(context);
                
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Recording saved as "$name"'),
                    duration: const Duration(seconds: 2),
                  ),
                );
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
} 