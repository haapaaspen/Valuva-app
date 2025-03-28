import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';
import 'package:valuva/widgets/widgets.dart';

class EditorScreen extends StatefulWidget {
  final String? projectId;

  const EditorScreen({super.key, this.projectId});

  @override
  State<EditorScreen> createState() => _EditorScreenState();
}

class _EditorScreenState extends State<EditorScreen> {
  @override
  void initState() {
    super.initState();
    
    // Load the project if a projectId was provided
    if (widget.projectId != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Provider.of<ProjectProvider>(context, listen: false)
            .loadProject(widget.projectId!);
      });
    }
    
    // Initialize the animation provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AnimationProvider>(context, listen: false).initialize();
    });
  }

  @override
  Widget build(BuildContext context) {
    final uiProvider = Provider.of<UIProvider>(context);
    final projectProvider = Provider.of<ProjectProvider>(context);
    final project = projectProvider.currentProject;
    
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        if (didPop) return;

        // Ask to save changes before navigating back
        if (project != null) {
          final save = await _showSaveDialog(context);
          if (save == null) {
            return;
          }
          
          if (save) {
            await projectProvider.saveCurrentProject();
          }
          
          projectProvider.closeCurrentProject();
        }
        
        if (context.mounted) {
          Navigator.of(context).pop();
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(project?.name ?? 'New Project'),
          actions: [
            IconButton(
              icon: const Icon(Icons.save),
              onPressed: project == null
                  ? null
                  : () => projectProvider.saveCurrentProject(),
              tooltip: 'Save Project',
            ),
            IconButton(
              icon: const Icon(Icons.settings),
              onPressed: project == null
                  ? null
                  : () => _showProjectSettings(context),
              tooltip: 'Project Settings',
            ),
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: () async {
                if (project != null) {
                  final save = await _showSaveDialog(context);
                  if (save == null) {
                    return;
                  }
                  
                  if (save) {
                    await projectProvider.saveCurrentProject();
                  }
                  
                  projectProvider.closeCurrentProject();
                }
                
                if (context.mounted) {
                  Navigator.of(context).pop();
                }
              },
              tooltip: 'Close Project',
            ),
          ],
        ),
        body: Column(
          children: [
            // Toolbar
            const Toolbar(),
            
            // Main content area
            Expanded(
              child: Row(
                children: [
                  // Elements panel (left)
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: uiProvider.elementsExpanded ? 250 : 50,
                    child: const ElementsPanel(),
                  ),
                  
                  // Canvas area (center)
                  Expanded(
                    child: Column(
                      children: [
                        // Canvas view
                        Expanded(
                          child: Container(
                            color: AppTheme.canvasBackgroundColor,
                            child: const CanvasView(),
                          ),
                        ),
                        
                        // Timeline panel (bottom)
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          height: uiProvider.timelineExpanded ? 150 : 50,
                          child: const TimelinePanel(),
                        ),
                      ],
                    ),
                  ),
                  
                  // Right panels
                  Column(
                    children: [
                      // Layers panel (top right)
                      Expanded(
                        flex: 1,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          width: uiProvider.layersExpanded ? 250 : 50,
                          child: const LayersPanel(),
                        ),
                      ),
                      
                      // Properties panel (bottom right)
                      Expanded(
                        flex: 1,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          width: uiProvider.propertiesExpanded ? 250 : 50,
                          child: const PropertiesPanel(),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Future<bool?> _showSaveDialog(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Save Changes?'),
        content: const Text('Do you want to save your changes?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Don\'t Save'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(null),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
  
  void _showProjectSettings(BuildContext context) {
    final projectProvider = Provider.of<ProjectProvider>(context, listen: false);
    final project = projectProvider.currentProject;
    
    if (project == null) return;
    
    final nameController = TextEditingController(text: project.name);
    final widthController = TextEditingController(text: project.width.toString());
    final heightController = TextEditingController(text: project.height.toString());
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Project Settings'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: 'Project Name',
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: widthController,
                    decoration: const InputDecoration(
                      labelText: 'Width (px)',
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextField(
                    controller: heightController,
                    decoration: const InputDecoration(
                      labelText: 'Height (px)',
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
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
              final name = nameController.text.trim();
              final width = double.tryParse(widthController.text.trim()) ?? project.width;
              final height = double.tryParse(heightController.text.trim()) ?? project.height;
              
              if (name.isNotEmpty) {
                final updatedProject = project.copyWith(
                  name: name,
                  width: width,
                  height: height,
                  modified: DateTime.now().toIso8601String(),
                );
                
                projectProvider.saveProject(updatedProject);
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