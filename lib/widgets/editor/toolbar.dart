import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';

class Toolbar extends StatelessWidget {
  const Toolbar({super.key});

  @override
  Widget build(BuildContext context) {
    final uiProvider = Provider.of<UIProvider>(context);
    
    return Container(
      height: AppTheme.toolbarHeight,
      color: AppTheme.panelBackgroundColor,
      child: Row(
        children: [
          // Elements panel toggle
          IconButton(
            icon: Icon(
              uiProvider.elementsExpanded 
                  ? Icons.chevron_left 
                  : Icons.chevron_right,
            ),
            onPressed: () => uiProvider.toggleElementsPanel(),
            tooltip: 'Toggle Elements Panel',
          ),
          
          const SizedBox(width: 8),
          const VerticalDivider(),
          const SizedBox(width: 8),
          
          // Tool selection buttons
          _buildToolButton(
            context,
            ToolType.select,
            Icons.pan_tool_alt,
            'Select Tool',
          ),
          _buildToolButton(
            context,
            ToolType.shape,
            Icons.crop_square,
            'Shape Tool',
          ),
          _buildToolButton(
            context,
            ToolType.text,
            Icons.text_fields,
            'Text Tool',
          ),
          _buildToolButton(
            context,
            ToolType.image,
            Icons.image,
            'Image Tool',
          ),
          _buildToolButton(
            context,
            ToolType.forcefield,
            Icons.waves,
            'Forcefield Tool',
          ),
          _buildToolButton(
            context,
            ToolType.eraser,
            Icons.delete,
            'Eraser Tool',
          ),
          
          const Spacer(),
          
          // Layers panel toggle
          IconButton(
            icon: Icon(
              uiProvider.layersExpanded 
                  ? Icons.chevron_right 
                  : Icons.chevron_left,
            ),
            onPressed: () => uiProvider.toggleLayersPanel(),
            tooltip: 'Toggle Layers Panel',
          ),
          
          // Properties panel toggle
          IconButton(
            icon: Icon(
              uiProvider.propertiesExpanded 
                  ? Icons.chevron_right 
                  : Icons.chevron_left,
            ),
            onPressed: () => uiProvider.togglePropertiesPanel(),
            tooltip: 'Toggle Properties Panel',
          ),
        ],
      ),
    );
  }
  
  Widget _buildToolButton(
    BuildContext context, 
    ToolType type, 
    IconData icon, 
    String tooltip
  ) {
    final uiProvider = Provider.of<UIProvider>(context);
    final isSelected = uiProvider.selectedTool == type;
    
    return Tooltip(
      message: tooltip,
      child: Material(
        color: isSelected ? AppTheme.primaryColor.withOpacity(0.2) : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: () => uiProvider.setSelectedTool(type),
          borderRadius: BorderRadius.circular(8),
          child: Container(
            width: 40,
            height: 40,
            alignment: Alignment.center,
            child: Icon(
              icon,
              color: isSelected ? AppTheme.primaryColor : null,
            ),
          ),
        ),
      ),
    );
  }
} 