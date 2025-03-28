import 'package:flutter/material.dart';

import 'package:valuva/models/models.dart';
import 'package:valuva/utils/app_theme.dart';

class ProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const ProjectCard({
    super.key,
    required this.project,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    // Format the date for display
    final DateTime created = DateTime.parse(project.created);
    final DateTime modified = DateTime.parse(project.modified);
    
    final String formattedDate = modified.difference(DateTime.now()).inDays == 0 
        ? 'Today at ${modified.hour}:${modified.minute.toString().padLeft(2, '0')}'
        : '${modified.day}/${modified.month}/${modified.year}';
    
    return Card(
      elevation: 4.0,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTheme.cornerRadius),
      ),
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Project preview/thumbnail
            AspectRatio(
              aspectRatio: project.canvasWidth / project.canvasHeight,
              child: Container(
                color: AppTheme.backgroundColor,
                child: Center(
                  child: Icon(
                    Icons.image_outlined,
                    size: 48,
                    color: Colors.grey[600],
                  ),
                ),
              ),
            ),
            
            // Project info
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Project name
                  Text(
                    project.name,
                    style: Theme.of(context).textTheme.titleLarge,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  // Last modified date
                  Text(
                    'Modified: $formattedDate',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  
                  // Layer count
                  Text(
                    '${project.layers.length} layers',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Delete button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.delete_outline, size: 20),
                        color: AppTheme.errorColor,
                        onPressed: onDelete,
                        tooltip: 'Delete Project',
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
} 