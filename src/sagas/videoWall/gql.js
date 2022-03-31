import gql from 'graphql-tag'

export const GET_VIDEO_WALL_TEMPLATES = gql`
  query {
    getVideoWallTemplates {
      id
      name
      description
      shape
      columnCount
      rowCount
    }
  }
`
