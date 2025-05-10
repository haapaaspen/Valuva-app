# Valuva AI Graphics Plugin

A DaVinci Resolve Workflow Integration Plugin for creating and editing HTML-based graphics.

## Project Structure

This workspace contains two main folders:
- `com.valuva.ai-graphics`: Main code repository for the Valuva AI Graphics plugin
- `Developer`: Contains DaVinci Resolve SDK documentation and reference materials

## Installation

1. Copy the entire `com.valuva.ai-graphics` folder to:
   - Mac: `/Library/Application Support/Blackmagic Design/DaVinci Resolve/Workflow Integration Plugins/`
   - Windows: `%PROGRAMDATA%\Blackmagic Design\DaVinci Resolve\Support\Workflow Integration Plugins\`

2. Start or restart DaVinci Resolve.

3. In DaVinci Resolve, go to `Workspace > Workflow Integrations` and select "Valuva AI Graphics".

## Usage

1. Click "Select HTML File" to load an HTML graphic.
   - Use the provided `sample-graphic.html` file for testing.

2. The plugin will extract text elements and CSS parameters from the file.

3. Edit the parameters in the sidebar to customize the graphic.

4. Click "Update Preview" to see changes in real-time.

5. Click "Export to Timeline" to create a Fusion title in the current timeline.

## Features

- Load and preview HTML-based graphics
- Extract text and style parameters
- Interactive parameter editing
- Real-time preview updates
- Export to Resolve timeline as video / image (need to figure the best option)

## Requirements

- DaVinci Resolve Studio 18.0 or later

## Technical Details

This plugin demonstrates:
- Secure HTML file loading
- Parameter extraction from HTML/CSS
- Real-time HTML preview
- Integration with Resolve's API
- Sandboxed Electron implementation 