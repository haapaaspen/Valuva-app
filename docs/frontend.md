# Frontend Documentation

## Technology Stack
- **Framework:** Flutter
- **Animation Engine:** Rive (formerly Flare)
- **State Management:** Provider (with potential upgrade to Riverpod for MVP)
- **UI Components:** Material Design + Custom Components
- **Local Storage:** path_provider for file system access

## UI Architecture

### Layout Structure

**Mobile Layout:**
- Main top bar containing:
  - Elements panel (collapsed to icons)
  - Layers panel toggle button
  - Global animation controls toggle button
- Secondary context-sensitive design controls bar (appears when elements selected)
- All controls initially shown as icons that can be expanded
- Full-screen canvas

**Desktop Layout:**
- Similar to Figma's panel arrangement:
  - Tools/elements panel on left
  - Canvas in center
  - Layers panel on right
  - Properties/design panel on far right

### Theme
- Dark theme with rounded UI elements
- Professional appearance similar to video editing software
- High contrast for better visibility of design elements

## Core Components

### Canvas System
- Rendering via CustomPaint and Rive
- Support for various element types (shapes, text, images)
- Interaction handling (selection, movement, scaling)
- Integration with forcefield system

### Forcefield Tool
- Path creation interface where users draw a stroke-like path
- Visual representation as a transparent, animated "river/wind" effect to indicate motion
- Element attachment system:
  - Elements on the same layer can be dragged onto the forcefield
  - Elements "snap" to the forcefield path and become its children
  - Parent-child relationship is maintained even when forcefield is modified
  - Elements retain their original properties (color, size, etc.) while being affected by forcefield motion
- Animation calculation engine:
  - Path-based movement calculations handled by Rive
  - Direction can be toggled (forward/reverse)
  - Speed can be controlled via a dial in the design panel

### Animation Controls
- Global timeline with standard playback controls:
  - Slider that visualizes the entire animation
  - Play/pause button
  - Record pinned button (saves animations in individual forcefields)
- Local forcefield controls in design panel:
  - Individual time slider (default input binding)
  - Direction toggle
  - Speed dial
  - Animation selector with defaults and saved recordings
  - Record button for capturing custom animation patterns
- Sliders can be "popped" into floating windows for visibility when elements aren't selected
- Recording system:
  - Captures user manipulation of sliders over time
  - Saves recording with user-defined name
  - Adds recording to animation selection list
- Platform-specific input methods:
  - Mobile: sliders, device pitch/yaw, virtual joysticks (by combining sliders)
  - Desktop: keyboard bindings for directional control, mouse control

### Project Management
- Local file storage system
- Project creation/loading interface
- Auto-save functionality

## State Management Strategy
- Provider for main application state
- Separate models for:
  - Project state (overall project metadata)
  - Canvas state (elements, layers, selection)
  - Animation state:
    - Global timeline position
    - Individual forcefield timelines
    - Recording status
    - Animation playback status
  - UI state (panel visibility, tool selection)
- Careful state separation to prevent unnecessary rebuilds during animation playback

## Performance Optimization
- RepaintBoundary for canvas isolation
- Efficient element rendering
- Animation calculation optimization
- Progressive loading for large projects