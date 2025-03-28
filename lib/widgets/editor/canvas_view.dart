import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';

class CanvasView extends StatelessWidget {
  const CanvasView({super.key});

  @override
  Widget build(BuildContext context) {
    final projectProvider = Provider.of<ProjectProvider>(context);
    final uiProvider = Provider.of<UIProvider>(context);
    
    final project = projectProvider.currentProject;
    if (project == null) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }
    
    return Container(
      color: Colors.grey[900],
      child: Center(
        child: Transform.scale(
          scale: uiProvider.zoomLevel,
          child: Transform.translate(
            offset: uiProvider.canvasOffset,
            child: Container(
              width: project.canvasWidth,
              height: project.canvasHeight,
              color: AppTheme.backgroundColor,
              child: Stack(
                children: [
                  // Grid pattern for visual reference
                  CustomPaint(
                    painter: GridPainter(),
                    size: Size(project.canvasWidth, project.canvasHeight),
                  ),
                  
                  // Placeholder text
                  Center(
                    child: Text(
                      'Canvas - ${project.canvasWidth.toInt()} x ${project.canvasHeight.toInt()}',
                      style: const TextStyle(color: Colors.white54),
                    ),
                  ),
                  
                  // TODO: Render actual canvas elements here
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    const gridSize = 20.0;
    final paint = Paint()
      ..color = Colors.grey.withAlpha(51)  // 0.2 opacity = 51 alpha
      ..strokeWidth = 0.5;
    
    // Draw vertical lines
    for (var i = 0.0; i <= size.width; i += gridSize) {
      canvas.drawLine(
        Offset(i, 0),
        Offset(i, size.height),
        paint,
      );
    }
    
    // Draw horizontal lines
    for (var i = 0.0; i <= size.height; i += gridSize) {
      canvas.drawLine(
        Offset(0, i),
        Offset(size.width, i),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
} 