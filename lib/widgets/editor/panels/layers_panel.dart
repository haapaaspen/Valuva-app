import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';
import 'package:valuva/models/models.dart';

class LayersPanel extends StatelessWidget {
  const LayersPanel({super.key});

  @override
  Widget build(BuildContext context) {
    final uiProvider = Provider.of<UIProvider>(context);
    final projectProvider = Provider.of<ProjectProvider>(context);
    final bool isCollapsed = uiProvider.layersPanelState == PanelState.collapsed;
    
    final project = projectProvider.currentProject;
    if (project == null) {
      return Container(color: AppTheme.surfaceColor);
    }
    
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
                ? const Icon(Icons.layers, size: 24)
                : Row(
                    children: [
                      const Icon(Icons.layers, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Layers',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.add, size: 20),
                        onPressed: () => _addLayer(context),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        visualDensity: VisualDensity.compact,
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20),
                        onPressed: () => uiProvider.toggleLayersPanel(),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        visualDensity: VisualDensity.compact,
                      ),
                    ],
                  ),
          ),
          
          const Divider(height: 1),
          
          // Layers list
          if (isCollapsed)
            _buildCollapsedLayersList(context, project)
          else
            Expanded(
              child: _buildExpandedLayersList(context, project),
            ),
        ],
      ),
    );
  }
  
  Widget _buildCollapsedLayersList(BuildContext context, Project project) {
    // In collapsed mode, just show active layer and button to toggle visibility
    final activeLayer = project.activeLayer;
    
    if (activeLayer == null) {
      return const SizedBox.shrink();
    }
    
    return Column(
      children: [
        Tooltip(
          message: activeLayer.name,
          child: Container(
            width: double.infinity,
            height: 48,
            alignment: Alignment.center,
            child: Text(
              activeLayer.name.substring(0, 1).toUpperCase(),
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ),
        Tooltip(
          message: activeLayer.visible ? 'Hide Layer' : 'Show Layer',
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                // Toggle layer visibility
                final projectProvider = Provider.of<ProjectProvider>(context, listen: false);
                final updatedLayer = activeLayer.copyWith(visible: !activeLayer.visible);
                projectProvider.updateLayer(updatedLayer);
              },
              child: Container(
                width: double.infinity,
                height: 48,
                alignment: Alignment.center,
                child: Icon(
                  activeLayer.visible ? Icons.visibility : Icons.visibility_off,
                  size: 24,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
  
  Widget _buildExpandedLayersList(BuildContext context, Project project) {
    final layerOrder = project.layerOrder;
    
    return Column(
      children: [
        Expanded(
          child: ReorderableListView.builder(
            itemCount: layerOrder.length,
            itemBuilder: (context, index) {
              final layerId = layerOrder[index];
              final layer = project.layers[layerId];
              
              if (layer == null) {
                return const SizedBox.shrink(key: ValueKey('empty'));
              }
              
              return _buildLayerTile(context, layer, layerId == project.activeLayerId);
            },
            onReorder: (oldIndex, newIndex) {
              // Handle reordering layers
              final projectProvider = Provider.of<ProjectProvider>(context, listen: false);
              
              // Adjust for removing and inserting
              if (oldIndex < newIndex) {
                newIndex -= 1;
              }
              
              final newOrder = List<String>.from(layerOrder);
              final item = newOrder.removeAt(oldIndex);
              newOrder.insert(newIndex, item);
              
              projectProvider.reorderLayers(newOrder);
            },
          ),
        ),
        
        // Bottom actions
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: () => _addLayer(context),
                tooltip: 'Add Layer',
              ),
              IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () => _deleteActiveLayer(context),
                tooltip: 'Delete Layer',
              ),
              IconButton(
                icon: const Icon(Icons.merge_type),
                onPressed: () {
                  // TODO: Implement merge layers
                },
                tooltip: 'Merge Layers',
              ),
              IconButton(
                icon: const Icon(Icons.content_copy),
                onPressed: () {
                  // TODO: Implement duplicate layer
                },
                tooltip: 'Duplicate Layer',
              ),
            ],
          ),
        ),
      ],
    );
  }
  
  Widget _buildLayerTile(BuildContext context, Layer layer, bool isActive) {
    return Material(
      key: ValueKey(layer.id),
      color: isActive ? AppTheme.primaryColor.withOpacity(0.3) : Colors.transparent,
      child: ListTile(
        leading: Icon(
          layer.visible ? Icons.visibility : Icons.visibility_off,
          size: 20,
        ),
        title: Text(
          layer.name,
          style: TextStyle(
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              layer.locked ? Icons.lock : Icons.lock_open,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text('${layer.elements.length}'),
          ],
        ),
        onTap: () {
          // Set as active layer
          Provider.of<ProjectProvider>(context, listen: false)
              .setActiveLayer(layer.id);
        },
        onLongPress: () {
          // Show layer options
          _showLayerOptions(context, layer);
        },
      ),
    );
  }
  
  void _addLayer(BuildContext context) {
    final TextEditingController nameController = TextEditingController(text: 'New Layer');
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Layer'),
        content: TextField(
          controller: nameController,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Layer Name',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final layerName = nameController.text.trim();
              if (layerName.isNotEmpty) {
                Provider.of<ProjectProvider>(context, listen: false)
                    .addLayer(layerName);
                Navigator.pop(context);
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }
  
  void _deleteActiveLayer(BuildContext context) {
    final projectProvider = Provider.of<ProjectProvider>(context, listen: false);
    final project = projectProvider.currentProject;
    
    if (project == null || project.activeLayer == null) {
      return;
    }
    
    if (project.layers.length <= 1) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cannot delete the only layer'),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Layer'),
        content: Text('Are you sure you want to delete "${project.activeLayer!.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
            ),
            onPressed: () {
              projectProvider.deleteLayer(project.activeLayerId);
              Navigator.pop(context);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
  
  void _showLayerOptions(BuildContext context, Layer layer) {
    final projectProvider = Provider.of<ProjectProvider>(context, listen: false);
    
    final TextEditingController nameController = TextEditingController(text: layer.name);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Layer: ${layer.name}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: 'Layer Name',
              ),
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Visible'),
              value: layer.visible,
              onChanged: (value) {
                // Update layer visibility
                final updatedLayer = layer.copyWith(visible: value);
                projectProvider.updateLayer(updatedLayer);
                Navigator.pop(context);
              },
            ),
            SwitchListTile(
              title: const Text('Locked'),
              value: layer.locked,
              onChanged: (value) {
                // Update layer lock status
                final updatedLayer = layer.copyWith(locked: value);
                projectProvider.updateLayer(updatedLayer);
                Navigator.pop(context);
              },
            ),
            Slider(
              value: layer.opacity,
              min: 0.0,
              max: 1.0,
              divisions: 10,
              label: '${(layer.opacity * 100).toInt()}%',
              onChanged: (value) {
                // Update layer opacity
                final updatedLayer = layer.copyWith(opacity: value);
                projectProvider.updateLayer(updatedLayer);
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final layerName = nameController.text.trim();
              if (layerName.isNotEmpty) {
                // Update layer name
                final updatedLayer = layer.copyWith(name: layerName);
                projectProvider.updateLayer(updatedLayer);
                Navigator.pop(context);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
} 