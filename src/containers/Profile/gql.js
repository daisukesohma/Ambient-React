import gql from 'graphql-tag'

export const GET_NOTIFICATION_METHODS = gql`
  {
    getNotificationMethods {
      id
      method
    }
  }
`

export const UPDATE_CURRENT_PROFILE = gql`
  mutation UpdateProfile(
    $firstName: String
    $lastName: String
    $email: String
    $countryCode: String
    $isoCode: String
    $phoneNumber: String
    $mfaOptIn: Boolean
    $hmNotificationsOptIn: [Int]
    $img: Upload
  ) {
    updateProfile(
      firstName: $firstName
      lastName: $lastName
      email: $email
      countryCode: $countryCode
      isoCode: $isoCode
      phoneNumber: $phoneNumber
      mfaOptIn: $mfaOptIn
      hmNotificationsOptIn: $hmNotificationsOptIn
      img: $img
    ) {
      id
      ok
      message
      user {
        firstName
        lastName
        username
        email
        id
      }
      profile {
        id
        countryCode
        phoneNumber
        mfaOptIn
        img
        internal
        hmNotificationsOptIn {
          method
          id
        }
      }
    }
  }
`

export const UPLOAD_PROFILE_IMAGE = gql`
  mutation UploadProfileImage($img: Upload!) {
    uploadProfileImage(img: $img) {
      ok
      img
    }
  }
`

export const ROLLBACK_UI = gql`
  mutation RollbackUI {
    rollbackUi {
      redirect
    }
  }
`

export const DELETE_PROFILE_IMAGE = gql`
  mutation DeleteProfileImage {
    deleteProfileImage {
      ok
    }
  }
`
