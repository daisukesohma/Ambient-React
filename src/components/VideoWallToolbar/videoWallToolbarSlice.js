/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import remove from 'lodash/remove'

export const initialState = {
  // videoWall states
  videoWalls: [],
  streams: [],
  search: '',

  loading: false,
  creationLoading: false,
  editLoading: false,
  deleteLoading: false,
  deleteRequestedVideoWall: null,

  // folder states
  folders: [],
  folderLoading: false,
  folderCreationLoading: false,
  folderEditLoading: false,
  folderDeleteLoading: false,
  folderDeleteRequestId: null,
  error: null,
}

const slice = createSlice({
  name: 'videoWallToolbar',
  initialState,

  reducers: {
    videoWallTemplatesFetchRequested: (state, action) => {
      state.videoWallTemplateFetchLoading = true
    },
    videoWallTemplatesFetchSucceeded: (state, action) => {
      state.videoWallTemplates = action.payload.videoWallTemplates
      state.videoWallTemplateFetchLoading = false
    },
    videoWallTemplatesFetchFailed: (state, action) => {
      state.error = action.payload.error
      state.videoWallTemplateFetchLoading = false
    },

    videoWallsFetchRequested: (state, action) => {
      state.loading = true
    },
    videoWallsFetchSucceeded: (state, action) => {
      state.videoWalls = action.payload.videoWalls
      state.loading = false
    },
    videoWallsFetchFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },

    videoWallCreateRequested: (state, action) => {
      state.creationLoading = true
    },
    videoWallCreateSucceeded: (state, action) => {
      state.videoWalls.unshift(action.payload.videoWall)
      // state.videoWalls[0].editMode = true // open in editMode new videoWall
      state.creationLoading = false
    },
    videoWallCreateFailed: (state, action) => {
      state.error = action.payload.error
      state.creationLoading = false
    },

    videoWallEditRequested: (state, action) => {
      state.editLoading = true
    },
    videoWallEditSucceeded: (state, action) => {
      const index = findIndex(state.videoWalls, {
        id: action.payload.videoWall.id,
      })
      state.videoWalls[index] = action.payload.videoWall
      state.editLoading = false
    },
    videoWallEditFailed: (state, action) => {
      state.error = action.payload.error
      state.editLoading = false
    },

    videoWallDestroyRequested: (state, action) => {
      state.deleteRequestedVideoWall = action.payload.videoWall
    },
    videoWallDestroyConfirmed: (state, action) => {
      state.deleteLoading = true
    },
    videoWallDestroyCancelled: (state, action) => {
      state.deleteRequestedVideoWall = null
    },

    videoWallDestroySucceeded: (state, action) => {
      remove(state.videoWalls, { id: action.payload.id })
      state.deleteLoading = false
      state.deleteRequestedVideoWall = null
    },
    videoWallDestroyFailed: (state, action) => {
      state.error = action.payload.error
      state.deleteLoading = false
    },

    setSearch: (state, action) => {
      state.search = action.payload.search
    },

    foldersFetchRequested: (state, action) => {
      state.folderLoading = true
    },
    foldersFetchSucceeded: (state, action) => {
      state.folders = action.payload.folders
      state.folderLoading = false
    },
    foldersFetchFailed: (state, action) => {
      state.folderLoading = false
      state.error = action.payload.error
    },

    folderCreateRequested: (state, action) => {
      state.folderCreationLoading = true
    },
    folderCreateSucceeded: (state, action) => {
      state.folders.unshift(action.payload.folder)
      state.folders[0].editMode = true
      state.folderCreationLoading = false
    },
    folderCreateFailed: (state, action) => {
      state.error = action.payload.error
      state.folderCreationLoading = false
    },

    folderApplySucceeded: (state, action) => {
      // find previous videoWall Folder
      const updatedVideoWall = action.payload.videoWall
      state.folders.forEach(folder => {
        const { children } = folder
        if (children) {
          if (folder.id === updatedVideoWall.folder.id) {
            // need to add
            children.push(updatedVideoWall)
          } else {
            // if not, just remove
            remove(children, videoWall => videoWall.id === updatedVideoWall.id)
          }
        }
      })
    },
    videoWallUpdateForFolderSucceeded: (state, action) => {
      const renamedVideoWall = action.payload.videoWall
      const updatedFolder = find(
        state.folders,
        folder => folder.id === renamedVideoWall.folder.id,
      )
      if (updatedFolder) {
        const videoWallIndex = findIndex(
          updatedFolder.children,
          videoWall => videoWall.id === renamedVideoWall.id,
        )
        if (videoWallIndex !== -1) {
          updatedFolder.children[videoWallIndex] = renamedVideoWall
        }
      }
    },
    removeFromFolder: (state, action) => {
      const folderIndex = findIndex(state.folders, {
        id: action.payload.folderId,
      })
      if (folderIndex !== -1) {
        remove(state.folders[folderIndex].children, {
          id: action.payload.videoWallId,
        })
      }
    },

    folderEditRequested: (state, action) => {
      state.folderEditLoading = true
    },
    folderEditSucceeded: (state, action) => {
      const folderEditIndex = findIndex(state.folders, {
        id: action.payload.folder.id,
      })
      state.folders[folderEditIndex] = action.payload.folder
      state.folderEditLoading = false
    },
    folderEditFailed: (state, action) => {
      state.error = action.payload.error
      state.folderEditLoading = false
    },

    folderDestroyRequested: (state, action) => {
      state.folderDeleteRequestId = action.payload.folderId
    },
    folderDestroyConfirmed: (state, action) => {
      state.folderDeleteLoading = true
    },
    folderDestroyCancelled: (state, action) => {
      state.folderDeleteRequestId = null
    },

    folderDestroySucceeded: (state, action) => {
      remove(state.folders, {
        id: action.payload.folderId,
      })
      state.folderDeleteLoading = false
      state.folderDeleteRequestId = null
    },
    folderDestroyFailed: (state, action) => {
      state.error = action.payload.error
      state.folderDeleteLoading = false
      state.folderDeleteRequestId = null
    },
  },
})

export const {
  videoWallTemplatesFetchRequested,
  videoWallTemplatesFetchSucceeded,
  videoWallTemplatesFetchFailed,

  videoWallsFetchRequested,
  videoWallsFetchSucceeded,
  videoWallsFetchFailed,

  videoWallCreateRequested,
  videoWallCreateSucceeded,
  videoWallCreateFailed,

  videoWallEditRequested,
  videoWallEditSucceeded,
  videoWallEditFailed,

  videoWallDestroyRequested,
  videoWallDestroyConfirmed,
  videoWallDestroyCancelled,

  videoWallDestroySucceeded,
  videoWallDestroyFailed,

  setSearch,

  foldersFetchRequested,
  foldersFetchSucceeded,
  foldersFetchFailed,

  folderCreateRequested,
  folderCreateSucceeded,
  folderCreateFailed,

  folderApplySucceeded,
  videoWallUpdateForFolderSucceeded,
  removeFromFolder,

  folderEditRequested,
  folderEditSucceeded,
  folderEditFailed,

  folderDestroyRequested,
  folderDestroyConfirmed,
  folderDestroyCancelled,

  folderDestroySucceeded,
  folderDestroyFailed,
} = slice.actions

export default slice.reducer
