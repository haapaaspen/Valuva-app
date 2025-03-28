import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/models/models.dart';
import 'package:valuva/providers/providers.dart';
import 'project_card.dart';

class ProjectGridItem extends StatelessWidget {
  final Project project;
  final VoidCallback onTap;

  const ProjectGridItem({
    Key? key,
    required this.project,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ProjectCard(
      project: project,
      onTap: onTap,
      onDelete: () => _deleteProject(context, project.id),
    );
  }

  Future<void> _deleteProject(BuildContext context, String projectId) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Project?'),
        content: const Text(
          'This action cannot be undone. All project data will be permanently lost.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: Colors.red,
            ),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    
    if (confirmed == true && context.mounted) {
      await Provider.of<ProjectProvider>(context, listen: false)
          .deleteProject(projectId);
    }
  }
} 