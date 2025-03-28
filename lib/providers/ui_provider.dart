import 'package:flutter/material.dart';

enum ToolType {
  select,
  shape,
  text,
  image,
  forcefield,
  eraser,
}

enum PanelState {
  collapsed,
  expanded,
  floating,
}

class UIProvider extends ChangeNotifier {
  // Current tool
  ToolType _selectedTool = ToolType.select;
  
  // Selected elements
  final Set<String> _selectedElementIds = {};
  
  // Panel visibility states
  PanelState _elementsPanelState = PanelState.expanded;
  PanelState _layersPanelState = PanelState.expanded;
  PanelState _propertiesPanelState = PanelState.expanded;
  PanelState _timelinePanelState = PanelState.collapsed;
  
  // Canvas settings
  double _zoomLevel = 1.0;
  Offset _canvasOffset = Offset.zero;
  
  // Shape creation settings
  String _selectedShapeType = 'rectangle';
  Map<String, dynamic> _shapeStyle = {
    'fillColor': Colors.blue.value,
    'strokeColor': Colors.black.value,
    'strokeWidth': 2.0,
  };
  
  // Text creation settings
  Map<String, dynamic> _textStyle = {
    'color': Colors.black.value,
    'fontSize': 24.0,
    'fontWeight': FontWeight.normal.index,
    'fontFamily': 'Roboto',
    'isBold': false,
    'isItalic': false,
    'isUnderlined': false,
  };

  // Device info
  bool _isMobile = false;
  
  // Panel states
  bool _elementsExpanded = true;
  bool _layersExpanded = true;
  bool _propertiesExpanded = true;
  bool _timelineExpanded = true;
  
  // Getters
  ToolType get selectedTool => _selectedTool;
  ToolType get currentTool => _selectedTool;
  Set<String> get selectedElementIds => Set.from(_selectedElementIds);
  bool get hasSelection => _selectedElementIds.isNotEmpty;
  
  PanelState get elementsPanelState => _elementsPanelState;
  PanelState get layersPanelState => _layersPanelState;
  PanelState get propertiesPanelState => _propertiesPanelState;
  PanelState get timelinePanelState => _timelinePanelState;
  
  double get zoomLevel => _zoomLevel;
  Offset get canvasOffset => _canvasOffset;
  
  String get selectedShapeType => _selectedShapeType;
  Map<String, dynamic> get shapeStyle => Map.from(_shapeStyle);
  Map<String, dynamic> get textStyle => Map.from(_textStyle);
  
  bool get isMobile => _isMobile;
  
  bool get elementsExpanded => _elementsExpanded;
  bool get layersExpanded => _layersExpanded;
  bool get propertiesExpanded => _propertiesExpanded;
  bool get timelineExpanded => _timelineExpanded;
  
  // Initialize with device info
  void initialize({required bool isMobile}) {
    _isMobile = isMobile;
    
    // Adjust panel states based on device
    if (isMobile) {
      _elementsPanelState = PanelState.collapsed;
      _layersPanelState = PanelState.collapsed;
      _propertiesPanelState = PanelState.collapsed;
    }
  }
  
  // Tool selection
  void setSelectedTool(ToolType tool) {
    _selectedTool = tool;
    notifyListeners();
  }
  
  // Element selection
  void selectElement(String elementId) {
    _selectedElementIds.clear();
    _selectedElementIds.add(elementId);
    notifyListeners();
  }
  
  void addToSelection(String elementId) {
    _selectedElementIds.add(elementId);
    notifyListeners();
  }
  
  void removeFromSelection(String elementId) {
    _selectedElementIds.remove(elementId);
    notifyListeners();
  }
  
  void clearSelection() {
    _selectedElementIds.clear();
    notifyListeners();
  }
  
  // Panel state control
  void toggleElementsPanel() {
    _elementsExpanded = !_elementsExpanded;
    notifyListeners();
  }
  
  void toggleLayersPanel() {
    _layersExpanded = !_layersExpanded;
    notifyListeners();
  }
  
  void togglePropertiesPanel() {
    _propertiesExpanded = !_propertiesExpanded;
    notifyListeners();
  }
  
  void toggleTimelinePanel() {
    _timelineExpanded = !_timelineExpanded;
    notifyListeners();
  }
  
  void setElementsPanelState(PanelState state) {
    _elementsPanelState = state;
    notifyListeners();
  }
  
  void setLayersPanelState(PanelState state) {
    _layersPanelState = state;
    notifyListeners();
  }
  
  void setPropertiesPanelState(PanelState state) {
    _propertiesPanelState = state;
    notifyListeners();
  }
  
  void setTimelinePanelState(PanelState state) {
    _timelinePanelState = state;
    notifyListeners();
  }
  
  // Canvas control
  void setZoomLevel(double zoom) {
    _zoomLevel = zoom.clamp(0.1, 5.0);
    notifyListeners();
  }
  
  void setCanvasOffset(Offset offset) {
    _canvasOffset = offset;
    notifyListeners();
  }
  
  void resetCanvasView() {
    _zoomLevel = 1.0;
    _canvasOffset = Offset.zero;
    notifyListeners();
  }
  
  // Shape settings
  void setSelectedShapeType(String shapeType) {
    _selectedShapeType = shapeType;
    notifyListeners();
  }
  
  void setShapeStyle(Map<String, dynamic> style) {
    _shapeStyle = Map.from(style);
    notifyListeners();
  }
  
  void updateShapeStyle(String property, dynamic value) {
    _shapeStyle[property] = value;
    notifyListeners();
  }
  
  // Text settings
  void setTextStyle(Map<String, dynamic> style) {
    _textStyle = Map.from(style);
    notifyListeners();
  }
  
  void updateTextStyle(String property, dynamic value) {
    _textStyle[property] = value;
    notifyListeners();
  }
} 