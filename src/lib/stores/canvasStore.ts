import { writable } from 'svelte/store';
import { generateId } from '$lib/utils/idGenerator';

// Define annotation type
type Annotation = {
  id: string;
  type: 'pen' | 'text' | 'shape';
  points?: Array<[number, number]>;
  text?: string;
  color: string;
  width: number;
  position?: { x: number, y: number };
};

// Canvas dimensions and settings
export const canvasDimensions = writable({
  width: 1920,
  height: 1080
});

// Canvas view settings
export const canvasZoom = writable(1);
export const canvasPosition = writable({ x: 0, y: 0 });

// Selected element on canvas
export const selectedElement = writable<string | null>(null);

// Annotation mode
export const annotationMode = writable<'none' | 'pen' | 'text' | 'shape'>('none');
export const annotations = writable<Annotation[]>([]);

// HTML content being displayed
export const htmlContent = writable('');
export const cssContent = writable('');
export const jsContent = writable('');

// CSS properties of selected element
export const selectedElementStyles = writable<Record<string, string>>({});

// Methods for manipulating canvas
export function resetCanvas() {
  htmlContent.set('');
  cssContent.set('');
  jsContent.set('');
  annotations.set([]);
  selectedElement.set(null);
  selectedElementStyles.set({});
}

export function updateCanvasContent(html: string, css: string, js = '') {
  htmlContent.set(html);
  cssContent.set(css);
  jsContent.set(js);
}

export function clearAnnotations() {
  annotations.set([]);
}

export function addAnnotation(annotation: Omit<Annotation, 'id'>) {
  annotations.update(current => [
    ...current,
    {
      ...annotation,
      id: generateId()
    }
  ]);
}

export function removeAnnotation(id: string) {
  annotations.update(current => current.filter(a => a.id !== id));
}

export function updateSelectedElementStyle(property: string, value: string) {
  selectedElementStyles.update(styles => ({
    ...styles,
    [property]: value
  }));
} 