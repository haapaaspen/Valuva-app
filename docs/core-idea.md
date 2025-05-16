Valuva: AI Motion Graphics Design Assistant for DaVinci Resolve

Valuva is an AI-powered design assistant, built as an Electron app using Svelte.js and TypeScript, designed to integrate with DaVinci Resolve as a Workflow Integration plugin. Its primary goal is to help users generate and refine static motion graphics elements (no animation in the first prototype) through an interactive, chat-based interface, rendering designs using HTML, CSS, and JavaScript.

Core Functionalities & Features:

HTML+CSS+JS Renderer: The main canvas renders the design output. As the final render is an HTML+CSS+JS file, this viewer accurately represents the output.
Draggable Design "Artifacts": The LLM can return design "artifacts" (e.g., pre-styled text blocks, color palettes, layout components – anything describable with HTML/CSS/JS) that the user can drag and drop onto the canvas to build or modify their design.
Annotation Overlay:
A "Toggle annotation overlay button" activates/deactivates a visual annotation layer.
Users can draw directly on this layer on top of the rendered design using basic tools provided in the toolbar. These annotations serve as visual instructions or feedback for the AI.
Toolbar (Bottom Center):

Includes a standard mouse cursor for selecting HTML elements directly on the canvas.
Provides basic drawing/annotation tools intended for use with the annotation overlay feature.
Effects & Styling (Right Panel - "EFFECTS"):

CSS-Driven Controls: This panel allows users to apply and adjust effects. It features:
Default basic text effects.
Dynamic controls that are derived from CSS properties. This suggests the AI can generate CSS for styling, and the app translates these properties into interactive UI controls (e.g., sliders for font-size, color pickers for color).
Context-Sensitive Updates: The controls and values displayed in the Effects panel dynamically update based on the element currently selected on the canvas, allowing for targeted styling.
Application Settings (Top Right):

An "Add settings button" provides access to general application-level settings for Valuva itself.
Overall Workflow Impression:

The user initiates a design by providing textual and potentially visual (via attachments and annotations) prompts. They can choose to brainstorm multiple ideas or focus on creating a final product. The AI responds with a core idea summary, visual guidance, and design "artifacts" (HTML/CSS/JS elements). The user can then interact with these on a live canvas, drag-and-drop elements, make direct visual annotations for the AI, and refine styles using a CSS-driven effects panel. The process is iterative, with the user guiding the AI to the desired static graphic.
