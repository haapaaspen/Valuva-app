**Valuva: AI Motion Graphics Design Assistant for DaVinci Resolve**

Valuva is an AI-powered design assistant, built as an Electron app using Svelte.js and TypeScript, designed to integrate with DaVinci Resolve as a Workflow Integration plugin. Its primary goal is to help users generate and refine static motion graphics elements (no animation in the first prototype) through an interactive, chat-based interface, rendering designs using HTML, CSS, and JavaScript.

**Core Functionalities & Features:**

1.  **Chat-Based Prompting & Idea Generation (Left Panel):**
    *   **New Chat Initiation:** Users start a new design session via the "NEW CHAT" interface.
    *   **Guided Prompts:**
        *   Users can define specific text elements (e.g., "Main title," "Secondary title") by inputting text content and desired style instructions (e.g., "flowy, italic, cool").
        *   The "+" button allows users to add more guided prompt fields for additional distinct elements.
        *   Each guided prompt can have its own attachments (e.g., reference images – UI buttons for this are planned).
    *   **General Textarea Prompt:** A freeform textarea allows users to provide broader context, overall instructions, or describe the desired mood/theme, complementing the guided prompts.
    *   **Prompt-to-Annotation Mockup:** A key feature allows text from the guided prompts to be opened directly in the annotation view. This enables users to visually position and arrange these text elements, creating a quick mockup to provide clear spatial instructions to the AI.
    *   **Operational Modes ("I want to"):**
        *   **Brainstorm:** The LLM generates multiple design suggestions or "artifacts" based on the prompt.
        *   **Create the final product:** The LLM focuses on generating or finessing a single, more complete graphic based on the prompt and any prior iterations.

2.  **AI-Generated Core Idea & Design Guidance (Center Top):**
    *   **LLM Generated Summary ("CORE IDEA"):** The AI provides a textual summary of its understanding of the design request or the core concept it's working on. This summary is editable by the user, allowing for refinement of the AI's interpretation.
    *   **Visual Design Guidance:** The system can display other forms of design guidance, such as reference images, font examples, or visual representations of CSS styles, overlaid on the main viewer. Users can edit, add, or drag new "artifacts" to this area.

3.  **Interactive Canvas/Viewer & Annotation (Center):**
    *   **HTML+CSS+JS Renderer:** The main canvas renders the design output. As the final render is an HTML+CSS+JS file, this viewer accurately represents the output.
    *   **Draggable Design "Artifacts":** The LLM can return design "artifacts" (e.g., pre-styled text blocks, color palettes, layout components – anything describable with HTML/CSS/JS) that the user can drag and drop onto the canvas to build or modify their design.
    *   **Annotation Overlay:**
        *   A "Toggle annotation overlay button" activates/deactivates a visual annotation layer.
        *   Users can draw directly on this layer on top of the rendered design using basic tools provided in the toolbar. These annotations serve as visual instructions or feedback for the AI.

4.  **Toolbar (Bottom Center):**
    *   Includes a standard mouse cursor for selecting HTML elements directly on the canvas.
    *   Provides basic drawing/annotation tools intended for use with the annotation overlay feature.

5.  **Effects & Styling (Right Panel - "EFFECTS"):**
    *   **CSS-Driven Controls:** This panel allows users to apply and adjust effects. It features:
        *   Default basic text effects.
        *   Dynamic controls that are derived from CSS properties. This suggests the AI can generate CSS for styling, and the app translates these properties into interactive UI controls (e.g., sliders for `font-size`, color pickers for `color`).
    *   **Context-Sensitive Updates:** The controls and values displayed in the Effects panel dynamically update based on the element currently selected on the canvas, allowing for targeted styling.

6.  **Application Settings (Top Right):**
    *   An "Add settings button" provides access to general application-level settings for Valuva itself.

**Overall Workflow Impression:**

The user initiates a design by providing textual and potentially visual (via attachments and annotations) prompts. They can choose to brainstorm multiple ideas or focus on creating a final product. The AI responds with a core idea summary, visual guidance, and design "artifacts" (HTML/CSS/JS elements). The user can then interact with these on a live canvas, drag-and-drop elements, make direct visual annotations for the AI, and refine styles using a CSS-driven effects panel. The process is iterative, with the user guiding the AI to the desired static graphic.