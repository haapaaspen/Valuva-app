# Backend Documentation

## Local-First Approach
For the prototype phase, the application will use a local-first approach with no backend server requirements.

## Data Storage
- Projects stored locally on device using the file system
- File access via the path_provider package
- JSON-based project format with supporting assets
- Rive animation files stored alongside project data

## Future Backend Considerations
Backend implementation will be considered for the MVP phase after prototype validation.

Potential backend features to consider:
- User authentication
- Cloud project storage
- Project sharing
- Collaboration features

## Data Models

### Project Structure
```json
{
  "id": "unique-project-id",
  "name": "Project Name",
  "created": "ISO-date",
  "modified": "ISO-date",
  "canvasWidth": 1024,
  "canvasHeight": 768,
  "layerOrder": ["layer1-id", "layer2-id", "..."],
  "activeLayerId": "layer1-id"
}
```

### Layer Structure
```json
{
  "id": "layer1-id",
  "name": "Layer 1",
  "visible": true,
  "locked": false,
  "opacity": 1.0,
  "elements": [
    {
      "id": "element1-id",
      "type": "shape|text|image|forcefield",
      "properties": {
        // Element-specific properties
      },
      "childrenIds": ["element2-id", "..."]
    }
  ]
}
```

### Animation Integration
- Rive format used for animation storage and playback
- Forcefields represented as Rive animations with path-based movement
- Custom recording format compatible with Rive:
  - Recordings captured as keyframe data
  - Saved animations accessible within project files
  - Animation data references elements via IDs

### Forcefield Data Model
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

### Animation Data Model
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

### Asset Management
- Assets (images, etc.) stored in a dedicated assets folder within project directory
- Asset references maintained in project JSON via relative paths
- Assets imported via image_picker are copied to project assets folder

### Data Versioning
- Project files include version field to support future format changes
- Upward migration strategy for loading older project files
- Version history tracked within project metadata for compatibility