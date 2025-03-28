# Forcefield Feature

## Overview

The forcefield is the core innovative feature of the Valuva app, designed to make motion graphics accessible to everyone. It's a path-based animation tool that allows users to create dynamic animations without complex timelines or keyframes.

Forcefields act as "rivers" or "streams" that elements can be placed on. These elements then follow the forcefield's path during animation playback. The forcefield itself is invisible in the final render but is visualized during editing as a transparent, animated "river/wind" effect to indicate flow direction.

## User Interaction

### Creation
- Users select the forcefield tool from the elements panel
- Draw a path on the canvas like they would draw a regular stroke
- The direction of the stroke determines the default animation direction
- The forcefield appears as a transparent, animated "river/wind" visual

### Element Attachment
- Elements on the same layer can be dragged onto the forcefield
- Elements automatically "snap" to the forcefield path and become its "children"
- Elements retain their original properties (color, size, etc.)
- Elements remain stationary on the forcefield by default
- Elements only move when animation is played (via local controls or global timeline)

### Configuration
The forcefield can be configured via the design panel:
- **Direction toggle**: Reverses the flow direction from the drawn path
- **Speed dial**: Controls the animation speed
- **Local slider + controls**: Preview and record forcefield-specific animations
- **Animation selection list**: Choose from default animations ("linear") or saved custom recordings

## Animation Controls

### Global Controls
- **Timeline slider**: Visualizes and controls the entire animation
- **Play/pause button**: Controls global playback
- **Record pinned button**: Records animations in all forcefields simultaneously

### Local Controls (per forcefield)
- **Individual time slider**: Controls just that forcefield's animation
- **Direction toggle**: Reverses the flow direction
- **Speed dial**: Adjusts animation rate
- **Record button**: Captures custom slider movements
- **Animation selector**: Choose saved animations

### Slider Features
- Sliders can be "popped" into floating windows for visibility when elements aren't selected
- Sliders can be manipulated to create custom animation patterns

## Recording System

### Recording Process
1. User presses record button (local to a forcefield or global)
2. Manipulates the slider(s) to create desired movement pattern
3. Stops recording
4. Names and saves the recording
5. Recording appears in the animation selection list

### Input Methods
- **Mobile**:
  - Touch sliders for basic control
  - Device pitch/yaw sensors by tilting the device
  - Virtual joysticks by combining two sliders
- **Desktop**:
  - Keyboard bindings for animation direction control
  - Mouse for slider manipulation

## Working with Multiple Forcefields

- Users can create multiple forcefields on the same or different layers
- Elements can be attached to a single forcefield at a time
- When global playback is used:
  - All forcefields animate simultaneously
  - Each forcefield affects only its child elements
  - The global record button saves the animation of each forcefield separately
- When recording individual forcefields:
  - Only the selected forcefield is affected
  - Other forcefields remain static or can be controlled separately
- Multiple forcefields can be coordinated to create complex animations

## Technical Implementation

### Animation Engine
The forcefield feature is powered by the Rive animation engine:
- Path-based animations for forcefields
- Parent-child relationships between forcefields and elements
- Managed animation timeline for both global and local playback
- Support for custom animation recording and playback
- Visualization of the forcefield effect

### Forcefield Controller
```dart
import 'package:rive/rive.dart';

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

## Data Model

### Forcefield Structure
```json
{
  "id": "forcefield1-id",
  "type": "forcefield",
  "properties": {
    "path": [{"x": 10, "y": 20}, {"x": 30, "y": 40}, "..."],
    "direction": "forward|reverse",
    "speed": 1.0,
    "selectedAnimation": "animation1-id"
  }
}
```

### Animation Structure
```json
{
  "id": "animation1-id",
  "name": "Animation Name",
  "type": "linear|recorded|custom",
  "duration": 5000,
  "keyframes": [
    {
      "time": 0,
      "value": 0.0
    },
    {
      "time": 2500,
      "value": 0.5
    },
    {
      "time": 5000,
      "value": 1.0
    }
  ]
}
```

## State Management

For the forcefield feature, state is managed in several parts:
- **Forcefield State**: Path, direction, speed, selected animation
- **Animation State**: 
  - Global timeline position
  - Individual forcefield timelines
  - Recording status
  - Animation playback status
- **Element-Forcefield Relationships**: Parent-child connections

## Performance Considerations

### Rive Performance
- **Asset Size**: Keep Rive animation files small and optimized
- **Artboard Management**: Use multiple artboards for complex animations
- **State Machine Complexity**: Limit the complexity of state machines
- **Bone Count**: Keep the number of bones in animations reasonable
- **Playback FPS**: Consider lower framerate for less powerful devices

### Canvas Optimization
- **RepaintBoundary**: Use RepaintBoundary widgets to isolate animations
- **BuildContext**: Minimize rebuilds by keeping animation state separate from UI state
- **Element Management**: Consider virtualization for projects with many elements 