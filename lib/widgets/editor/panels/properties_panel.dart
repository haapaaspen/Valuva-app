import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';
import 'package:valuva/models/models.dart';

class PropertiesPanel extends StatelessWidget {
  const PropertiesPanel({super.key});

  @override
  Widget build(BuildContext context) {
    final uiProvider = Provider.of<UIProvider>(context);
    final bool isCollapsed = uiProvider.propertiesPanelState == PanelState.collapsed;
    
    return Container(
      color: AppTheme.surfaceColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Panel header
          Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            alignment: Alignment.centerLeft,
            child: isCollapsed
                ? const Icon(Icons.tune, size: 24)
                : Row(
                    children: [
                      const Icon(Icons.tune, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Properties',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20),
                        onPressed: () => uiProvider.togglePropertiesPanel(),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        visualDensity: VisualDensity.compact,
                      ),
                    ],
                  ),
          ),
          
          const Divider(height: 1),
          
          // Panel content
          if (isCollapsed)
            _buildCollapsedPanel(context)
          else
            Expanded(
              child: _buildExpandedPanel(context),
            ),
        ],
      ),
    );
  }
  
  Widget _buildCollapsedPanel(BuildContext context) {
    final uiProvider = Provider.of<UIProvider>(context);
    
    if (!uiProvider.hasSelection) {
      return const SizedBox.shrink();
    }
    
    // Show different quick controls based on the current tool
    switch (uiProvider.currentTool) {
      case ToolType.select:
        return Column(
          children: [
            Tooltip(
              message: 'Bring Forward',
              child: IconButton(
                icon: const Icon(Icons.flip_to_front),
                onPressed: () {
                  // TODO: Implement bring forward
                },
              ),
            ),
            Tooltip(
              message: 'Send Backward',
              child: IconButton(
                icon: const Icon(Icons.flip_to_back),
                onPressed: () {
                  // TODO: Implement send backward
                },
              ),
            ),
            Tooltip(
              message: 'Delete',
              child: IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () {
                  // TODO: Implement delete
                },
              ),
            ),
          ],
        );
      default:
        return const SizedBox.shrink();
    }
  }
  
  Widget _buildExpandedPanel(BuildContext context) {
    final uiProvider = Provider.of<UIProvider>(context);
    final projectProvider = Provider.of<ProjectProvider>(context);
    
    final project = projectProvider.currentProject;
    if (project == null) {
      return const Center(
        child: Text('No project loaded'),
      );
    }
    
    // Show element properties if something is selected
    if (uiProvider.hasSelection) {
      final selectedElementId = uiProvider.selectedElementIds.first;
      
      // Find the selected element
      CanvasElement? selectedElement;
      Layer? parentLayer;
      
      for (final layerId in project.layerOrder) {
        final layer = project.layers[layerId];
        if (layer != null) {
          final element = layer.getElementById(selectedElementId);
          if (element != null) {
            selectedElement = element;
            parentLayer = layer;
            break;
          }
        }
      }
      
      if (selectedElement != null) {
        return _buildElementProperties(context, selectedElement, parentLayer);
      }
    }
    
    // If no element is selected, show canvas properties
    return _buildCanvasProperties(context, project);
  }
  
  Widget _buildElementProperties(
    BuildContext context, 
    CanvasElement element,
    Layer? parentLayer,
  ) {
    // Different property panels based on element type
    switch (element.type) {
      case 'shape':
        return _buildShapeProperties(context, element);
      case 'text':
        return _buildTextProperties(context, element);
      case 'image':
        return _buildImageProperties(context, element);
      case 'forcefield':
        return _buildForcefieldProperties(context, element);
      default:
        return const Center(
          child: Text('Unknown element type'),
        );
    }
  }
  
  Widget _buildShapeProperties(BuildContext context, CanvasElement element) {
    final properties = element.properties;
    
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Text(
          'Shape Properties',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 16),
        
        // Shape type
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Type'),
          subtitle: Text(properties['shape'] as String),
          leading: const Icon(Icons.category),
          dense: true,
        ),
        
        const Divider(),
        
        // Position
        Text(
          'Position & Size',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'X',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['x'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element position
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Y',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['y'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element position
                },
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 8),
        
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Width',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['width'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element size
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Height',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['height'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element size
                },
              ),
            ),
          ],
        ),
        
        const Divider(),
        
        // Style
        Text(
          'Style',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        // Fill color
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Fill Color'),
          leading: Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Color((properties['style'] as Map)['fillColor'] as int),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.white24),
            ),
          ),
          dense: true,
          onTap: () {
            // TODO: Implement color picker
          },
        ),
        
        // Stroke color
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Stroke Color'),
          leading: Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Color((properties['style'] as Map)['strokeColor'] as int),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.white24),
            ),
          ),
          dense: true,
          onTap: () {
            // TODO: Implement color picker
          },
        ),
        
        // Stroke width
        Row(
          children: [
            const Text('Stroke Width'),
            const SizedBox(width: 8),
            Expanded(
              child: Slider(
                value: (properties['style'] as Map)['strokeWidth'] as double,
                min: 0,
                max: 20,
                divisions: 20,
                label: (properties['style'] as Map)['strokeWidth'].toString(),
                onChanged: (value) {
                  // TODO: Update stroke width
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildTextProperties(BuildContext context, CanvasElement element) {
    final properties = element.properties;
    
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Text(
          'Text Properties',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 16),
        
        // Text content
        TextField(
          decoration: const InputDecoration(
            labelText: 'Text',
          ),
          controller: TextEditingController(
            text: properties['text'] as String,
          ),
          maxLines: 3,
          onChanged: (value) {
            // TODO: Update text content
          },
        ),
        
        const Divider(),
        
        // Position
        Text(
          'Position',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'X',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['x'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element position
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Y',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['y'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element position
                },
              ),
            ),
          ],
        ),
        
        const Divider(),
        
        // Style
        Text(
          'Style',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        // Text color
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Text Color'),
          leading: Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Color((properties['style'] as Map)['color'] as int),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.white24),
            ),
          ),
          dense: true,
          onTap: () {
            // TODO: Implement color picker
          },
        ),
        
        // Font size
        Row(
          children: [
            const Text('Font Size'),
            const SizedBox(width: 8),
            Expanded(
              child: Slider(
                value: (properties['style'] as Map)['fontSize'] as double,
                min: 8,
                max: 72,
                divisions: 64,
                label: (properties['style'] as Map)['fontSize'].toString(),
                onChanged: (value) {
                  // TODO: Update font size
                },
              ),
            ),
          ],
        ),
        
        // Formatting buttons
        Row(
          children: [
            ToggleButtons(
              isSelected: [
                (properties['style'] as Map)['isBold'] as bool,
                (properties['style'] as Map)['isItalic'] as bool,
                (properties['style'] as Map)['isUnderlined'] as bool,
              ],
              onPressed: (index) {
                // TODO: Update text formatting
              },
              borderRadius: BorderRadius.circular(4),
              children: const [
                Icon(Icons.format_bold),
                Icon(Icons.format_italic),
                Icon(Icons.format_underlined),
              ],
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildImageProperties(BuildContext context, CanvasElement element) {
    final properties = element.properties;
    
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Text(
          'Image Properties',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 16),
        
        // Image preview
        Container(
          height: 150,
          decoration: BoxDecoration(
            color: AppTheme.backgroundColor,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(color: Colors.white24),
          ),
          child: Center(
            child: Icon(
              Icons.image,
              size: 48,
              color: Colors.grey[600],
            ),
          ),
        ),
        
        const SizedBox(height: 8),
        Text(
          'Source: ${properties['source']}',
          style: Theme.of(context).textTheme.bodySmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        
        const Divider(),
        
        // Position & Size
        Text(
          'Position & Size',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'X',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['x'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element position
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Y',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['y'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element position
                },
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 8),
        
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Width',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['width'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element size
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Height',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: (properties['height'] as double).toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update element size
                },
              ),
            ),
          ],
        ),
        
        // Replace image button
        const SizedBox(height: 16),
        ElevatedButton.icon(
          onPressed: () {
            // TODO: Implement replace image
          },
          icon: const Icon(Icons.photo_library),
          label: const Text('Replace Image'),
          style: ElevatedButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
          ),
        ),
      ],
    );
  }
  
  Widget _buildForcefieldProperties(BuildContext context, CanvasElement element) {
    final properties = element.properties;
    final animationProvider = Provider.of<AnimationProvider>(context);
    
    final selectedAnimationId = properties['selectedAnimation'] as String?;
    
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Text(
          'Forcefield Properties',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 16),
        
        // Path info
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Path'),
          subtitle: Text('${(properties['path'] as List).length} points'),
          leading: const Icon(Icons.timeline),
          dense: true,
        ),
        
        const Divider(),
        
        // Direction control
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Reverse Direction'),
          value: properties['direction'] == 'reverse',
          onChanged: (value) {
            // TODO: Update forcefield direction
          },
        ),
        
        // Speed control
        Row(
          children: [
            const Text('Speed'),
            const SizedBox(width: 8),
            Expanded(
              child: Slider(
                value: properties['speed'] as double,
                min: 0.1,
                max: 5.0,
                divisions: 49,
                label: '${(properties['speed'] as double).toStringAsFixed(1)}x',
                onChanged: (value) {
                  // TODO: Update forcefield speed
                },
              ),
            ),
          ],
        ),
        
        const Divider(),
        
        // Animation selection
        Text(
          'Animation',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        DropdownButtonFormField<String>(
          decoration: const InputDecoration(
            labelText: 'Selected Animation',
          ),
          value: selectedAnimationId,
          items: animationProvider.getAnimationsForForcefield(element.id).map((animation) {
            return DropdownMenuItem<String>(
              value: animation.id,
              child: Text(animation.name),
            );
          }).toList(),
          onChanged: (newValue) {
            // TODO: Update selected animation
          },
        ),
        
        // Animation preview
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppTheme.backgroundColor,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(color: Colors.white24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Preview',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 8),
              
              // Animation timeline
              const LinearProgressIndicator(
                value: 0.5, // Replace with actual animation progress
              ),
              
              // Animation controls
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.play_arrow),
                    onPressed: () {
                      // TODO: Play forcefield animation
                    },
                    tooltip: 'Play',
                  ),
                  IconButton(
                    icon: const Icon(Icons.pause),
                    onPressed: () {
                      // TODO: Pause forcefield animation
                    },
                    tooltip: 'Pause',
                  ),
                  IconButton(
                    icon: const Icon(Icons.fiber_manual_record),
                    onPressed: () {
                      // TODO: Record custom animation
                    },
                    tooltip: 'Record',
                  ),
                ],
              ),
            ],
          ),
        ),
        
        // Record new animation button
        const SizedBox(height: 16),
        ElevatedButton.icon(
          onPressed: () {
            // TODO: Implement animation recording flow
          },
          icon: const Icon(Icons.fiber_manual_record),
          label: const Text('Record New Animation'),
          style: ElevatedButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
          ),
        ),
      ],
    );
  }
  
  Widget _buildCanvasProperties(BuildContext context, Project project) {
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Text(
          'Canvas Properties',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 16),
        
        // Canvas size
        Text(
          'Canvas Size',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Width',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: project.canvasWidth.toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update canvas width
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Height',
                  suffixText: 'px',
                ),
                keyboardType: TextInputType.number,
                controller: TextEditingController(
                  text: project.canvasHeight.toStringAsFixed(0),
                ),
                onChanged: (value) {
                  // TODO: Update canvas height
                },
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 16),
        
        // Preset sizes
        Text(
          'Preset Sizes',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _buildCanvasSizePreset(context, 'Mobile', 360, 640),
            _buildCanvasSizePreset(context, 'Tablet', 768, 1024),
            _buildCanvasSizePreset(context, 'Desktop', 1280, 720),
            _buildCanvasSizePreset(context, 'Instagram', 1080, 1080),
            _buildCanvasSizePreset(context, 'Story', 1080, 1920),
            _buildCanvasSizePreset(context, '16:9', 1920, 1080),
          ],
        ),
        
        const Divider(),
        
        // Project info
        Text(
          'Project Info',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Name'),
          subtitle: Text(project.name),
          dense: true,
        ),
        
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Created'),
          subtitle: Text(_formatDate(DateTime.parse(project.created))),
          dense: true,
        ),
        
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Modified'),
          subtitle: Text(_formatDate(DateTime.parse(project.modified))),
          dense: true,
        ),
        
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Layers'),
          subtitle: Text('${project.layers.length} layers'),
          dense: true,
        ),
      ],
    );
  }
  
  Widget _buildCanvasSizePreset(
    BuildContext context, 
    String label, 
    double width, 
    double height,
  ) {
    return ElevatedButton(
      onPressed: () {
        // TODO: Update canvas size
      },
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        backgroundColor: AppTheme.surfaceColor,
      ),
      child: Text('$label ($width×$height)'),
    );
  }
  
  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
} 