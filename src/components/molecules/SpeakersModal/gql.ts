import gql from 'graphql-tag'

export const GET_SPEAKERS = gql`
  query SpeakersForStream($streamId: Int!) {
    speakersForStream(streamId: $streamId) {
      id
      name
      files {
        id
        fileId
        name
      }
    }
  }
`

export const PLAY_SPEAKER = gql`
  mutation PlaySpeakerFile($input: PlaySpeakerFileInput!) {
    playSpeakerFile(input: $input) {
      ok
      message
    }
  }
`
