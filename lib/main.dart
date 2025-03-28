import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:valuva/providers/providers.dart';
import 'package:valuva/utils/app_theme.dart';
import 'package:valuva/screens/home_screen.dart';
import 'package:valuva/screens/editor_screen.dart';
import 'package:valuva/models/models.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProjectProvider()),
        ChangeNotifierProvider(create: (_) => UIProvider()),
        ChangeNotifierProvider(create: (_) => AnimationProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Valuva',
        theme: ThemeData.dark().copyWith(
          colorScheme: const ColorScheme.dark(
            primary: AppTheme.primaryColor,
            secondary: AppTheme.accentColor,
            error: AppTheme.errorColor,
          ),
          primaryColor: AppTheme.primaryColor,
          scaffoldBackgroundColor: AppTheme.backgroundColor,
          appBarTheme: const AppBarTheme(
            backgroundColor: AppTheme.appBarColor,
            elevation: 0,
          ),
          dividerTheme: DividerTheme.of(context).copyWith(
            color: AppTheme.dividerColor,
          ),
          cardTheme: CardTheme.of(context).copyWith(
            color: AppTheme.cardColor,
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            filled: true,
            fillColor: AppTheme.inputFillColor,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: AppTheme.primaryColor,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
          textButtonTheme: TextButtonThemeData(
            style: TextButton.styleFrom(
              foregroundColor: AppTheme.accentColor,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
        ),
        home: const EditorStartup(),
        routes: {
          '/home': (ctx) => const HomeScreen(),
          '/editor': (ctx) => const EditorScreen(),
        },
      ),
    );
  }
}

// A startup screen that creates a default project and then shows the editor
class EditorStartup extends StatefulWidget {
  const EditorStartup({super.key});

  @override
  State<EditorStartup> createState() => _EditorStartupState();
}

class _EditorStartupState extends State<EditorStartup> {
  @override
  void initState() {
    super.initState();
    
    // Create a default project when the app starts
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final projectProvider = Provider.of<ProjectProvider>(context, listen: false);
      
      // Create a default project
      const defaultProjectName = 'Untitled Project';
      final project = Project.create(name: defaultProjectName);
      
      // Set it as the current project
      await projectProvider.createProjectInMemory(project);
      
      // Navigate directly to the editor screen
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => const EditorScreen(),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/logo.png',
              width: 120,
              height: 120,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(
                  Icons.animation,
                  size: 80,
                  color: AppTheme.primaryColor,
                );
              },
            ),
            const SizedBox(height: 24),
            const Text(
              'Valuva',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
