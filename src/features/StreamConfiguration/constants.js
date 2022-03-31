export const STREAM_WIDTH = 640
export const STREAM_HEIGHT = 480

export const STREAM_CONFIGURATION_MODES = {
  BOUNDING_BOX: 'BOUNDING_BOX',
  ENTITIES: 'ENTITIES',
  DEFAULT: null,
  POINT_ANNOTATION: 'POINT_ANNOTATION',
  ZONES: 'ZONES',
}

export const POINT_ANNOTATION_MODES = {
  DEFAULT: null,
  EDIT: 'EDIT',
  ADD: 'ADD',
}

// temporary holding for the entity options
export const ENTITY_ID_DOOR = 9

export const PAINTING_TOOLS = {
  PEN: 'PEN',
  ERASER: 'ERASER',
}

export const LINE_OPACITY = 0.5
export const POINT_OPACITY = 0.88

export const CANVAS_SIZE = { x: STREAM_WIDTH, y: STREAM_HEIGHT }
export const CANVAS_CENTER = { x: CANVAS_SIZE.x / 2, y: CANVAS_SIZE.y / 2 }

const POINT_LARGE = 24

export const DEFAULT_SHAPES = {
  rect: {
    visible: true,
    component: 'Rect',
    props: {
      x: 20,
      y: 50,
      width: 100,
      height: 100,
      fill: 'red',
      opacity: 0.5,
    },
    meta: {
      bbox: [20, 50, 120, 150],
    },
  },
  circle: {
    visible: true,
    component: 'Circle',
    props: {
      x: 100,
      y: 100,
      radius: 50,
      fill: '#18ffa6',
      opacity: 0.5,
    },
    meta: {},
  },
  // START, HOVER, END
  pointAnnotation: {
    visible: true,
    component: 'Circle',
    props: {
      fill: '#FF18E1',
      opacity: 0.4,
      radius: POINT_LARGE,
      stroke: '#FFFFFF',
      strokeWidth: 1,
      x: CANVAS_CENTER.x,
      y: CANVAS_CENTER.y,
    },
    unplacedHoverProps: {
      fill: '#18ffa6',
      opacity: 0.3,
      radius: POINT_LARGE,
    },
    placedHoverProps: {
      fill: '#18ffa6',
      opacity: 0.3,
      radius: 8,
    },
    dragProps: {
      fill: '#18ffa6',
      opacity: 0.2,
      radius: 8,
    },
    endProps: {
      fill: '#18ffa6',
      opacity: 0.4,
      radius: 3,
    },
    meta: {},
  },
}
