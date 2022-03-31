/*
 *  author: rodaan@ambient.ai
 *  Used to "fix" selections customer can use on entity search
 *  idx is the index within the array
 * TODO: Create a synonym section
 */
const EntitySubSelectionTree = {
  person: {
    id: 'person',
    name: 'person',
    type: 'entity',
    final: true,
    options: [
      {
        name: 'carrying',
        type: 'interaction',
        id: 'i_1',
        idx: 1,
        options: [
          {
            name: 'laptop',
            idx: 1,
            final: true,
            id: 'i_1_1',
          },
          {
            id: 'i_1_2',
            name: 'box',
            final: true,
            idx: 2,
          },
          {
            id: 'i_1_3',
            name: 'backpack',
            final: true,
            idx: 3,
          },
          {
            id: 'i_1_4',
            name: 'handbag',
            final: true,
            idx: 4,
          },
        ],
      },
      {
        id: 'i_5',
        name: 'riding',
        final: true,
        type: 'interaction',
        options: [
          {
            id: 'i_1_1',
            name: 'bicycle',
            final: true,
            idx: 1,
          },
        ],
        idx: 5,
      },
    ],
  },
  car: {
    id: 'car',
    name: 'car',
    final: true,
    type: 'entity',
  },
  truck: {
    id: 'truck',
    name: 'truck',
    final: true,
    type: 'entity',
  },
  bus: {
    id: 'bus',
    name: 'bus',
    final: true,
    type: 'entity',
  },
  door: {
    id: 'door',
    name: 'door',
    final: true,
    type: 'entity',
    options: [
      {
        id: 's_1',
        name: 'OPEN',
        final: true,
        type: 'state',
        options: [],
        idx: 1,
      },
      {
        id: 's_2',
        name: 'CLOSED',
        final: true,
        type: 'state',
        options: [],
        idx: 2,
      },
      {
        id: 'i_1',
        name: 'ENTER',
        type: 'interaction',
        options: [
          {
            name: 'person',
            idx: 1,
            final: true,
            id: 'i_1_1',
          },
        ],
        idx: 3,
      },
      {
        id: 'i_1',
        name: 'EXIT',
        type: 'interaction',
        options: [
          {
            name: 'person',
            idx: 1,
            final: true,
            id: 'i_1_1',
          },
        ],
        idx: 3,
      },
    ],
  },
  box: {
    id: 'box',
    name: 'box',
    final: true,
    type: 'entity',
    options: [],
  },
  backpack: {
    id: 'backpack',
    name: 'backpack',
    final: true,
    type: 'entity',
    options: [],
  },
  chair: {
    id: 'chair',
    name: 'chair',
    final: true,
    type: 'entity',
    options: [],
  },
  bicycle: {
    id: 'bicycle',
    name: 'bicycle',
    final: true,
    type: 'entity',
    options: [],
  },
  laptop: {
    id: 'laptop',
    name: 'laptop',
    final: true,
    type: 'entity',
    options: [],
  },
}

export default EntitySubSelectionTree
