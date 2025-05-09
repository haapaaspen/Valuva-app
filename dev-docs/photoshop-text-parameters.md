**I. Character Panel Parameters**

These parameters control the appearance of individual characters or selected ranges of text.

1.  **Font Family:**
    *   *Description:* The typeface design (e.g., Arial, Times New Roman, Futura).
    *   *Implementation:* Requires access to system fonts and potentially font files (TrueType, OpenType, etc.).

2.  **Font Style / Variant:**
    *   *Description:* The specific style within a font family (e.g., Regular, Italic, Bold, Light, Condensed, Black). Available styles depend on the selected font family.
    *   *Implementation:* Needs to read available styles from the font file.

3.  **Font Size:**
    *   *Description:* The height of the text. Usually measured in points (pt).
    *   *Implementation:* Numerical input, potentially with dropdown for units (points, pixels, inches, etc.).

4.  **Leading:**
    *   *Description:* The vertical space *between* lines of text (baseline to baseline). Can be set to Auto or a specific value (positive or negative).
    *   *Implementation:* Numerical input. Affects paragraph text primarily, but applicable to multiple lines of point text.

5.  **Kerning:**
    *   *Description:* The horizontal space *between two specific characters*. Used to adjust awkward pairings (e.g., "WA", "To"). Can be set to Auto, Optical, or a specific value (positive or negative) for selected characters.
    *   *Implementation:* Numerical input or dropdown for automatic methods. Applies only when a text cursor is placed *between* two characters.

6.  **Tracking:**
    *   *Description:* The horizontal space *between all selected characters* (or an entire block of text). Adjusts the overall density of the text block.
    *   *Implementation:* Numerical input (usually in 1/1000 em units).

7.  **Vertical Scale:**
    *   *Description:* Stretches or compresses the text vertically. Expressed as a percentage.
    *   *Implementation:* Percentage input. Should ideally scale relative to the original character height.

8.  **Horizontal Scale:**
    *   *Description:* Stretches or compresses the text horizontally. Expressed as a percentage.
    *   *Implementation:* Percentage input. Should ideally scale relative to the original character width.

9.  **Baseline Shift:**
    *   *Description:* Raises or lowers selected text relative to the baseline of the line. Useful for creating simple superscripts/subscripts without changing font size.
    *   *Implementation:* Numerical input (positive or negative).

10. **Color:**
    *   *Description:* The fill color of the text.
    *   *Implementation:* Color picker interface.

11. **Language:**
    *   *Description:* Specifies the language for hyphenation and spelling check (less of a style, more of a text property).
    *   *Implementation:* Dropdown list of supported languages.

12. **Stylistic Toggles (Checkboxes/Buttons):**
    *   *Description:* Apply common styles that might not be explicit font variants, or simulated styles.
    *   *Implementation:* Toggle buttons.
        *   **Faux Bold:** Artificially thickens the stroke of the text.
        *   **Faux Italic:** Artificially skews the text.
        *   **All Caps:** Converts selected text to uppercase.
        *   **Small Caps:** Converts selected text to uppercase, but the original uppercase letters are larger than the converted lowercase letters.
        *   **Superscript:** Reduces size and raises baseline.
        *   **Subscript:** Reduces size and lowers baseline.
        *   **Underline:** Draws a line beneath the text.
        *   **Strikethrough:** Draws a line through the text.

**II. Paragraph Panel Parameters**

These parameters control the alignment and spacing of entire paragraphs.

1.  **Alignment:**
    *   *Description:* Controls how lines of text within a paragraph are aligned.
    *   *Implementation:* Radio buttons or dropdown.
        *   Align Left
        *   Align Center
        *   Align Right
        *   Justify Last Left
        *   Justify Last Center
        *   Justify Last Right
        *   Justify All

2.  **Left Indent:**
    *   *Description:* Indents the left edge of the entire paragraph.
    *   *Implementation:* Numerical input.

3.  **Right Indent:**
    *   *Description:* Indents the right edge of the entire paragraph.
    *   *Implementation:* Numerical input.

4.  **First Line Indent:**
    *   *Description:* Indents only the first line of the paragraph.
    *   *Implementation:* Numerical input.

5.  **Space Before Paragraph:**
    *   *Description:* Adds vertical space *above* the paragraph.
    *   *Implementation:* Numerical input.

6.  **Space After Paragraph:**
    *   *Description:* Adds vertical space *below* the paragraph.
    *   *Implementation:* Numerical input.

7.  **Hyphenation:**
    *   *Description:* Toggles automatic hyphenation for paragraph text.
    *   *Implementation:* Checkbox. Requires a hyphenation dictionary for the selected language.

8.  **Composer:**
    *   *Description:* Controls how lines are broken within a paragraph to achieve the best fit. Adobe offers Single-line and Paragraph composers. The Paragraph composer considers multiple lines simultaneously.
    *   *Implementation:* Radio buttons or dropdown. Advanced layout algorithm.

**III. Options Bar Parameters (when Type tool is active)**

These often duplicate Character/Paragraph panel settings for quick access, but sometimes include unique ones.

1.  **Text Orientation:**
    *   *Description:* Toggles between Horizontal and Vertical text layout.
    *   *Implementation:* Button/Toggle. Changes the writing mode.

2.  **Anti-aliasing Method:** (Duplicate of Character Panel)

3.  **Warp Text:** (Launches a separate dialog, parameters listed below)

**IV. Warp Text Parameters**

These apply a geometric distortion effect to the text layer.

1.  **Style:**
    *   *Description:* Selects the type of warp transformation.
    *   *Implementation:* Dropdown list with predefined shapes (Arc, Arch, Bulge, Shell, Flag, Wave, Fish, Rise, Fisheye, Inflate, Squeeze, Twist, etc.).

2.  **Orientation:**
    *   *Description:* Applies the warp effect horizontally or vertically.
    *   *Implementation:* Radio buttons or toggle.

3.  **Bend:**
    *   *Description:* Controls the intensity of the primary warp effect.
    *   *Implementation:* Slider/Numerical input (percentage, positive or negative).

4.  **Horizontal Distortion:**
    *   *Description:* Controls the secondary distortion along the horizontal axis of the warp.
    *   *Implementation:* Slider/Numerical input (percentage, positive or negative).

5.  **Vertical Distortion:**
    *   *Description:* Controls the secondary distortion along the vertical axis of the warp.
    *   *Implementation:* Slider/Numerical input (percentage, positive or negative).

**V. Text Layer Properties (Fundamental, Not "Style" Parameters Per Se, But Important)**

These define the *type* of text layer and its bounds.

1.  **Text Type:**
    *   *Description:* Point Text (text expands from a click point) vs. Paragraph Text (text flows within a defined bounding box).
    *   *Implementation:* Determined when the text layer is created (single click for Point, click-and-drag for Paragraph). Affects how layout (indentation, alignment, hyphenation) behaves.

2.  **Bounding Box / Area Type Options:**
    *   *Description:* For Paragraph Text, defining the size and shape of the text container. In Photoshop, this is primarily a rectangle. More advanced editors might support text in arbitrary shapes or along paths.
    *   *Implementation:* Resizable bounding box.
