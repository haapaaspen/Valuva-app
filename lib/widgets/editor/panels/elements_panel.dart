import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/ui_provider.dart';
import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';

class ElementsPanel extends StatelessWidget {
  const ElementsPanel({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final uiProvider = Provider.of<UIProvider>(context);
    final isCollapsed = uiProvider.elementsPanelState == PanelState.collapsed;
    
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
                ? const Icon(Icons.category, size: 24)
                : Row(
                    children: [
                      const Icon(Icons.category, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Elements',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20),
                        onPressed: () => uiProvider.toggleElementsPanel(),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        visualDensity: VisualDensity.compact,
                      ),
                    ],
                  ),
          ),
          
          const Divider(height: 1),
          
          // Tool-specific elements panel content
          Expanded(
            child: _buildPanelContent(context, uiProvider),
          ),
        ],
      ),
    );
  }
  
  Widget _buildPanelContent(BuildContext context, UIProvider uiProvider) {
    final bool isCollapsed = uiProvider.elementsPanelState == PanelState.collapsed;
    
    // Show different content based on the selected tool
    switch (uiProvider.currentTool) {
      case ToolType.shape:
        return _buildShapePanel(context, isCollapsed);
      case ToolType.text:
        return _buildTextPanel(context, isCollapsed);
      case ToolType.image:
        return _buildImagePanel(context, isCollapsed);
      case ToolType.forcefield:
        return _buildForcefieldPanel(context, isCollapsed);
      case ToolType.select:
      case ToolType.eraser:
      default:
        return _buildDefaultPanel(context, isCollapsed);
    }
  }
  
  Widget _buildShapePanel(BuildContext context, bool isCollapsed) {
    final uiProvider = Provider.of<UIProvider>(context);
    if (isCollapsed) {
      return Column(
        children: [
          _buildElementButton(
            context: context,
            icon: Icons.crop_square_outlined,
            label: 'Rectangle',
            isCollapsed: isCollapsed,
          ),
          _buildElementButton(
            context: context,
            icon: Icons.circle_outlined,
            label: 'Circle',
            isCollapsed: isCollapsed,
          ),
          _buildElementButton(
            context: context,
            icon: Icons.change_history_outlined,
            label: 'Triangle',
            isCollapsed: isCollapsed,
          ),
          _buildElementButton(
            context: context,
            icon: Icons.star_border,
            label: 'Star',
            isCollapsed: isCollapsed,
          ),
        ],
      );
    }
    
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      children: [
        Text(
          'Basic Shapes',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _buildShapeItem(context, 'Rectangle', Icons.crop_square_outlined),
            _buildShapeItem(context, 'Circle', Icons.circle_outlined),
            _buildShapeItem(context, 'Triangle', Icons.change_history_outlined),
            _buildShapeItem(context, 'Star', Icons.star_border),
            _buildShapeItem(context, 'Polygon', Icons.hexagon_outlined),
            _buildShapeItem(context, 'Line', Icons.horizontal_rule),
          ],
        ),
        
        const SizedBox(height: 16),
        Text(
          'Style',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        
        // Color picker for fill
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Fill Color'),
          leading: Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Color(uiProvider.shapeStyle['fillColor'] as int),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.white24),
            ),
          ),
          dense: true,
          onTap: () {
            // TODO: Implement color picker
          },
        ),
        
        // Color picker for stroke
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Stroke Color'),
          leading: Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Color(uiProvider.shapeStyle['strokeColor'] as int),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.white24),
            ),
          ),
          dense: true,
          onTap: () {
            // TODO: Implement color picker
          },
        ),
        
        // Slider for stroke width
        Row(
          children: [
            const Text('Stroke Width'),
            const SizedBox(width: 8),
            Expanded(
              child: Slider(
                value: uiProvider.shapeStyle['strokeWidth'] as double,
                min: 0,
                max: 20,
                divisions: 20,
                label: uiProvider.shapeStyle['strokeWidth'].toString(),
                onChanged: (value) {
                  uiProvider.updateShapeStyle('strokeWidth', value);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildShapeItem(BuildContext context, String label, IconData icon) {
    return InkWell(
      onTap: () {
        // Set the selected shape
        Provider.of<UIProvider>(context, listen: false)
            .setSelectedShapeType(label.toLowerCase());
      },
      borderRadius: BorderRadius.circular(4),
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: AppTheme.backgroundColor,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: Colors.white24),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildTextPanel(BuildContext context, bool isCollapsed) {
    final uiProvider = Provider.of<UIProvider>(context);
    if (isCollapsed) {
      return Column(
        children: [
          _buildElementButton(
            context: context,
            icon: Icons.title,
            label: 'Heading',
            isCollapsed: isCollapsed,
          ),
          _buildElementButton(
            context: context,
            icon: Icons.text_fields,
            label: 'Paragraph',
            isCollapsed: isCollapsed,
          ),
        ],
      );
    }
    
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      children: [
        Text(
          'Text Styles',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        _buildTextStyleButton(context, 'Heading', 24.0),
        _buildTextStyleButton(context, 'Subheading', 18.0),
        _buildTextStyleButton(context, 'Paragraph', 16.0),
        _buildTextStyleButton(context, 'Caption', 12.0),
        
        const SizedBox(height: 16),
        Text(
          'Formatting',
          style: Theme.of(context).textTheme.titleSmall,
        ),
        
        // Font color
        ListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Text Color'),
          leading: Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Color(uiProvider.textStyle['color'] as int),
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
                value: uiProvider.textStyle['fontSize'] as double,
                min: 8,
                max: 72,
                divisions: 64,
                label: uiProvider.textStyle['fontSize'].toString(),
                onChanged: (value) {
                  uiProvider.updateTextStyle('fontSize', value);
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
                uiProvider.textStyle['isBold'] as bool,
                uiProvider.textStyle['isItalic'] as bool,
                uiProvider.textStyle['isUnderlined'] as bool,
              ],
              onPressed: (index) {
                if (index == 0) {
                  uiProvider.updateTextStyle('isBold', !(uiProvider.textStyle['isBold'] as bool));
                } else if (index == 1) {
                  uiProvider.updateTextStyle('isItalic', !(uiProvider.textStyle['isItalic'] as bool));
                } else if (index == 2) {
                  uiProvider.updateTextStyle('isUnderlined', !(uiProvider.textStyle['isUnderlined'] as bool));
                }
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
  
  Widget _buildTextStyleButton(BuildContext context, String style, double fontSize) {
    return ListTile(
      title: Text(
        style,
        style: TextStyle(fontSize: fontSize),
      ),
      contentPadding: EdgeInsets.zero,
      dense: true,
      onTap: () {
        // Set the selected text style
        Provider.of<UIProvider>(context, listen: false)
            .updateTextStyle('fontSize', fontSize);
      },
    );
  }
  
  Widget _buildImagePanel(BuildContext context, bool isCollapsed) {
    final uiProvider = Provider.of<UIProvider>(context);
    if (isCollapsed) {
      return Column(
        children: [
          _buildElementButton(
            context: context,
            icon: Icons.photo_library,
            label: 'Gallery',
            isCollapsed: isCollapsed,
          ),
          _buildElementButton(
            context: context,
            icon: Icons.camera_alt,
            label: 'Camera',
            isCollapsed: isCollapsed,
          ),
        ],
      );
    }
    
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Import Image',
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: 16),
          _buildImageSourceButton(
            context: context,
            icon: Icons.photo_library,
            label: 'From Gallery',
            onTap: () {
              // Import from gallery logic
            },
          ),
          const SizedBox(height: 8),
          _buildImageSourceButton(
            context: context,
            icon: Icons.camera_alt,
            label: 'Take Photo',
            onTap: () {
              // Take photo logic
            },
          ),
        ],
      ),
    );
  }
  
  Widget _buildImageSourceButton({
    required BuildContext context,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        minimumSize: const Size.fromHeight(48),
      ),
    );
  }
  
  Widget _buildForcefieldPanel(BuildContext context, bool isCollapsed) {
    final uiProvider = Provider.of<UIProvider>(context);
    if (isCollapsed) {
      return Column(
        children: [
          _buildElementButton(
            context: context,
            icon: Icons.waves,
            label: 'Draw Path',
            isCollapsed: isCollapsed,
          ),
        ],
      );
    }
    
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Forcefield Tool',
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: 16),
          const Text(
            'Draw a path on the canvas to create a forcefield. Elements can be dragged onto the forcefield to animate them.',
          ),
          const SizedBox(height: 16),
          const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.info_outline),
            title: Text('Draw a curved path to create interesting motion effects'),
            dense: true,
          ),
          const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.info_outline),
            title: Text('Multiple forcefields can be used on different elements'),
            dense: true,
          ),
        ],
      ),
    );
  }
  
  Widget _buildDefaultPanel(BuildContext context, bool isCollapsed) {
    final uiProvider = Provider.of<UIProvider>(context);
    if (isCollapsed) {
      return const SizedBox.shrink();
    }
    
    final tool = uiProvider.currentTool;
    
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            tool == ToolType.select ? 'Selection Tool' : 'Eraser Tool',
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: 16),
          Text(
            tool == ToolType.select
                ? 'Click on an element to select it. Drag to move it around.'
                : 'Click on an element to erase it from the canvas.',
          ),
        ],
      ),
    );
  }
  
  Widget _buildElementButton({
    required BuildContext context,
    required IconData icon,
    required String label,
    required bool isCollapsed,
  }) {
    if (isCollapsed) {
      return Tooltip(
        message: label,
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () {
              // Add element to canvas
            },
            child: Container(
              width: double.infinity,
              height: 48,
              alignment: Alignment.center,
              child: Icon(icon, size: 24),
            ),
          ),
        ),
      );
    }
    
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      onTap: () {
        // Add element to canvas
      },
    );
  }

  void _onToolChange(BuildContext context, String toolName) {
    final uiProvider = Provider.of<UIProvider>(context, listen: false);
    switch (toolName.toLowerCase()) {
      case 'select':
        uiProvider.setSelectedTool(ToolType.select);
        break;
      case 'shape':
        uiProvider.setSelectedTool(ToolType.shape);
        break;
      case 'text':
        uiProvider.setSelectedTool(ToolType.text);
        break;
      case 'image':
        uiProvider.setSelectedTool(ToolType.image);
        break;
      case 'forcefield':
        uiProvider.setSelectedTool(ToolType.forcefield);
        break;
    }
  }
} 