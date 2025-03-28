import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/widgets/widgets.dart';
import 'package:valuva/models/models.dart';
import 'editor_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    
    // Initialize project provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ProjectProvider>(context, listen: false).initialize();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: const Text('Valuva'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline),
            onPressed: () {
              // TODO: Show help dialog
            },
            tooltip: 'Help',
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // TODO: Show settings dialog
            },
            tooltip: 'Settings',
          ),
        ],
      ),
      body: Consumer<ProjectProvider>(
        builder: (ctx, projectProvider, _) {
          final projects = projectProvider.projects;
          
          return projects.isEmpty 
            ? _buildEmptyState(context)
            : _buildProjectGrid(context, projects);
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateProjectDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.folder_open,
            size: 80,
            color: Theme.of(context).colorScheme.primary.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'No projects yet',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            'Create a new project to get started',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => _showCreateProjectDialog(context),
            child: const Text('Create Project'),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectGrid(BuildContext context, List<Project> projects) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 3/2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: projects.length,
      itemBuilder: (ctx, i) => ProjectGridItem(
        project: projects[i],
        onTap: () => _openProject(context, projects[i]),
      ),
    );
  }

  void _showCreateProjectDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const CreateProjectDialog(),
    );
  }

  void _openProject(BuildContext context, Project project) {
    // Load the project and navigate to editor screen
    Provider.of<ProjectProvider>(context, listen: false)
        .loadProject(project.id);
    Navigator.of(context).pushNamed('/editor', arguments: project);
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