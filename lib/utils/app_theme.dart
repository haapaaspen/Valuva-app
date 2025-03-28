import 'package:flutter/material.dart';

/// App theme defines colors, dimensions and styles for the application
class AppTheme {
  // Primary colors
  static const Color primaryColor = Color(0xFF6200EE);
  static const Color accentColor = Color(0xFF03DAC6);
  static const Color errorColor = Color(0xFFB00020);
  
  // Background colors
  static const Color backgroundColor = Color(0xFF121212);
  static const Color appBarColor = Color(0xFF1D1D1D);
  static const Color cardColor = Color(0xFF2D2D2D);
  static const Color dividerColor = Color(0xFF3D3D3D);
  static const Color inputFillColor = Color(0xFF2A2A2A);
  
  // Panel colors
  static const Color panelBackgroundColor = Color(0xFF1E1E1E);
  static const Color panelHeaderColor = Color(0xFF333333);
  
  // Canvas colors
  static const Color canvasBackgroundColor = Color(0xFF2C2C2C);
  static const Color gridColor = Color(0xFF3A3A3A);
  
  // Surface color for panels
  static const Color surfaceColor = Color(0xFF2D2D2D);
  
  // Panel dimensions
  static const double panelWidth = 250.0;
  static const double collapsedPanelWidth = 64.0;
  static const double toolbarHeight = 56.0;
  static const double cornerRadius = 8.0;
  
  // Light theme for testing/comparison
  static ThemeData lightTheme() {
    return ThemeData.light().copyWith(
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        secondary: accentColor,
        error: errorColor,
      ),
    );
  }
  
  // Dark theme (default)
  static ThemeData darkTheme() {
    return ThemeData.dark().copyWith(
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: accentColor,
        error: errorColor,
      ),
      primaryColor: primaryColor,
      scaffoldBackgroundColor: backgroundColor,
      appBarTheme: const AppBarTheme(
        backgroundColor: appBarColor,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        color: cardColor,
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
        fillColor: inputFillColor,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.white,
          backgroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: accentColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }
} 