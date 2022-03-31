import { createSelector } from '@reduxjs/toolkit'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import map from 'lodash/map'
import forIn from 'lodash/forIn'
import groupBy from 'lodash/groupBy'

const folderStructureForPublicWalls = (videoWalls, activeVideoWall) => {
  const children = []
  const groupedPublicWallsByFolder = groupBy(videoWalls, 'folder.id')
  forIn(groupedPublicWallsByFolder, group => {
    const firstWall = group[0]
    if (firstWall.folder) {
      // folder exists
      children.push({
        ...firstWall,
        ...firstWall.folder,
        isPublicFolder: true,
        isActive: firstWall.folder.id === get(activeVideoWall, 'folder.id'),
        isFolder: true,
        children: map(sortBy(group, ['name']), videoWall => ({
          ...videoWall,
          isPublicVideoWall: true,
          isActive: videoWall.id === get(activeVideoWall, 'id'),
          isVideoWall: true, // need to show video wall list item
        })),
      })
    } else {
      group.forEach(videoWall => {
        children.push({
          ...videoWall,
          isPublicVideoWall: true,
          isActive: videoWall.id === get(activeVideoWall, 'id'),
          isVideoWall: true, // need to show video wall list item
        })
      })
    }
  })

  return children
}

export default ({ activeVideoWall }) => {
  return createSelector(
    [
      state => sortBy(state.videoWallToolbar.videoWalls, ['name']),
      state => sortBy(state.videoWallToolbar.folders, ['name']),
      state => state.videoWallToolbar.search,
      state => get(state, 'auth.user.id'),
    ],
    (videoWallCollection, folderCollection, search, currentUserId) => {
      const videoWalls = videoWallCollection.filter(
        videoWall =>
          get(videoWall, 'owner.user.id') === currentUserId && // only show own video walls
          videoWall.folder === null &&
          videoWall.name
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
      )

      const folders = folderCollection.filter(folder =>
        folder.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )

      const allPublicVideoWalls = videoWallCollection.filter(
        videoWall =>
          get(videoWall, 'owner.user.id') !== currentUserId && // only show other people's video walls
          videoWall.name
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
      )

      // generated tree structure
      return {
        isRoot: true,
        id: 'VideoWalls',
        icon: 'Video',
        name: 'Video Walls',
        isStream: false,
        children: [
          {
            id: 'shared-folder',
            name: 'Shared',
            isActive: get(activeVideoWall, 'folder.id') === 'shared-folder',
            isStream: false,
            icon: 'Users',
            children: folderStructureForPublicWalls(allPublicVideoWalls),
          },
          ...map(folders, folder => {
            return {
              // folders first
              ...folder,
              isActive: folder.id === get(activeVideoWall, 'folder.id'),
              isFolder: true,
              children: folder.children
                ? map(sortBy(folder.children, ['name']), videoWall => ({
                    ...videoWall,
                    ...videoWallCollection.find(
                      item => item.id === videoWall.id,
                    ),
                    isActive: videoWall.id === get(activeVideoWall, 'id'),
                    isVideoWall: true, // need to show video wall list item
                    isVideoWallUnderFolder: true,
                  }))
                : [],
            }
          }),
          ...videoWalls.map(videoWall => ({
            // private video walls without folders
            ...videoWall,
            isActive: videoWall.id === get(activeVideoWall, 'id'),
            isVideoWall: true,
          })),
        ],
      }
    },
  )
}
