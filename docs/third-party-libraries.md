# Third-Party Libraries Documentation

## Essential Libraries

### path_provider
- **Purpose:** Access device filesystem for project storage
- **Website:** https://pub.dev/packages/path_provider
- **Implementation:** Used to determine app document directory for storing project files
- **Example Usage:**
```dart
import 'package:path_provider/path_provider.dart';
import 'dart:io';

Future<String> getProjectsDirectory() async {
  final directory = await getApplicationDocumentsDirectory();
  final projectsDir = Directory('${directory.path}/projects');
  if (!await projectsDir.exists()) {
    await projectsDir.create(recursive: true);
  }
  return projectsDir.path;
}
```

### image_picker
- **Purpose:** Import images from camera or gallery
- **Website:** https://pub.dev/packages/image_picker
- **Implementation:** Used for adding photos directly into projects
- **Example Usage:**
```dart
import 'package:image_picker/image_picker.dart';
import 'dart:io';

Future<File?> pickImage() async {
  final picker = ImagePicker();
  final pickedFile = await picker.pickImage(source: ImageSource.gallery);
  
  if (pickedFile != null) {
    return File(pickedFile.path);
  }
  return null;
}
```

## Core Framework Libraries

### flutter
- **Purpose:** Main UI framework
- **Website:** https://flutter.dev
- **Implementation:** Core framework for building the entire application

### rive
- **Purpose:** Animation rendering engine
- **Website:** https://rive.app
- **Implementation:** Powers the forcefield animation system and element movement
- **Specific Usage for Forcefields:**
  - Creating path-based animations for forcefields 
  - Handling parent-child relationships between forcefields and elements
  - Managing the animation timeline for both global and local playback
  - Supporting custom animation recording and playback
  - Visualizing the forcefield as a transparent animated "river/wind" effect
- **Performance Considerations:**
  - Efficiently handles multiple simultaneous animations
  - Optimized for mobile devices with limited processing power
  - Allows for fine-grained control over animation complexity
- **Example Usage:**
```dart
import 'package:rive/rive.dart';

// Forcefield controller class
class ForceFieldController {
  // Rive artboard containing the forcefield animation
  Artboard? _artboard;
  // Controller for the path animation
  StateMachineController? _controller;
  // Input for controlling animation progress
  SMINumber? _progressInput;
  // Input for controlling animation direction
  SMIBool? _reverseInput;
  // Input for controlling animation speed
  SMINumber? _speedInput;
  
  // Initialize with a Rive file
  Future<void> initialize(String rivePath) async {
    // Load the Rive file
    final file = await RiveFile.asset(rivePath);
    final artboard = file.mainArtboard;
    
    // Get the state machine controller
    _controller = StateMachineController.fromArtboard(
      artboard, 
      'Forcefield_State_Machine'
    );
    
    if (_controller != null) {
      artboard.addController(_controller!);
      
      // Get inputs
      _progressInput = _controller!.findSMI('progress');
      _reverseInput = _controller!.findSMI('reverse');
      _speedInput = _controller!.findSMI('speed');
      
      _artboard = artboard;
    }
  }
  
  // Update animation progress
  void setProgress(double value) {
    _progressInput?.value = value;
  }
  
  // Toggle animation direction
  void setReverse(bool reverse) {
    _reverseInput?.value = reverse;
  }
  
  // Set animation speed
  void setSpeed(double speed) {
    _speedInput?.value = speed;
  }
  
  // Attach to a Rive widget
  Widget buildRiveAnimation() {
    return _artboard == null
      ? Container()
      : Rive(artboard: _artboard!);
  }
}
```

### provider
- **Purpose:** State management
- **Website:** https://pub.dev/packages/provider
- **Implementation:** Manages application state and UI updates
- **Example Usage:**
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ProjectModel extends ChangeNotifier {
  // State and methods
}

// In main.dart
ChangeNotifierProvider(
  create: (context) => ProjectModel(),
  child: MyApp(),
)
```

## Future Considerations

Libraries to consider adding for MVP phase:
- **Riverpod:** Enhanced state management if Provider becomes limiting
- **flutter_animate:** For UI animations outside the canvas
- **hive:** For more complex local storage needs
- **share_plus:** For exporting and sharing animations
- **firebase_core/firestore:** If adding backend functionality

## Performance Considerations

When implementing the animation system with these libraries, consider:

### Rive Performance
- **Asset Size:** Keep Rive animation files small and optimized
- **Artboard Management:** Use multiple artboards for complex animations
- **State Machine Complexity:** Limit the complexity of state machines
- **Bone Count:** Keep the number of bones in animations reasonable
- **Playback FPS:** Consider lower framerate for less powerful devices

### Flutter Rendering
- **RepaintBoundary:** Use RepaintBoundary widgets to isolate animations
- **BuildContext:** Minimize rebuilds by keeping animation state separate from UI state
- **Composition:** Use composition over inheritance for animation components
- **Canvas Optimization:** Minimize the number of draw calls and path complexity

### Provider Optimization
- **Selective Updates:** Use select() to listen only to required parts of a model
- **Granular Models:** Split models into smaller, focused providers
- **Computation Caching:** Cache expensive computations in providers