import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      payload
      refreshExpiresIn
      user {
        id
      }
      awsAccessKeyId
      token
    }
  }
`

export const GET_ALL_DATASETS = gql`
  query allDatasets($page: Int, $pageSize: Int) {
    allDatasets(page: $page, pageSize: $pageSize) {
      page
      pages
      count
      datasets {
        id
        datasetName
        dataType
        annotationType
        infoUrl
        timestampCreated
        timestampUpdated
      }
    }
  }
`

export const GET_ALL_DATASPLITS = gql`
  query allDatasplits($page: Int, $pageSize: Int) {
    allDatasplits(page: $page, pageSize: $pageSize) {
      page
      pages
      count
      datasplits {
        id
        datasplitName
        dataType
        annotationType
        infoUrl
        timestampCreated
        timestampUpdated
      }
    }
  }
`

export const GET_ALL_DATAPOINTS = gql`
  query allDatapoints($page: Int, $pageSize: Int) {
    allDatapoints(page: $page, pageSize: $pageSize) {
      page
      pages
      count
      datapoints {
        id
        dataFile
        dataType
        annotation
        annotationType
        dataSourcePrimary
        dataSourceSecondary
        streamId
        timestampCreated
        timezone
        timestampIndexed
        timestampUpdated
        presignedDataUrl
      }
    }
  }
`

export const GET_DATASET = gql`
  query dataset($datasetName: String!) {
    dataset(datasetName: $datasetName) {
      id
      datasetName
      dataType
      annotationType
      timestampCreated
      timestampUpdated
    }
  }
`

export const GET_DATASPLIT = gql`
  query datasplit($datasplitName: String!) {
    datasplit(datasplitName: $datasplitName) {
      id
      datasplitName
      dataType
      annotationType
      timestampCreated
      timestampUpdated
    }
  }
`

export const GET_DATAPOINT = gql`
  query datapoint($dataFile: String!) {
    datapoint(dataFile: $dataFile) {
      id
      dataFile
      dataType
      annotation
      annotationType
      dataSourcePrimary
      dataSourceSecondary
      streamId
      timestampCreated
      timezone
      timestampIndexed
      timestampUpdated
      datasplits {
        id
        datasplitName
      }
      presignedDataUrl
    }
  }
`

export const GET_DATASPLITS_BY_DATASET = gql`
  query datasplitsByDataset($datasetName: String!, $page: Int, $pageSize: Int) {
    datasplitsByDataset(
      datasetName: $datasetName
      page: $page
      pageSize: $pageSize
    ) {
      page
      pages
      count
      datasplits {
        id
        datasplitName
        dataType
        annotationType
        infoUrl
        timestampCreated
        timestampUpdated
      }
    }
  }
`

export const GET_DATAPOINTS_BY_DATASPLIT = gql`
  query datapointsByDatasplit(
    $datasplitName: String!
    $page: Int
    $pageSize: Int
  ) {
    datapointsByDatasplit(
      datasplitName: $datasplitName
      page: $page
      pageSize: $pageSize
    ) {
      page
      pages
      count
      datapoints {
        id
        dataFile
        dataType
        annotation
        annotationType
        dataSourcePrimary
        dataSourceSecondary
        streamId
        timestampCreated
        timezone
        timestampIndexed
        timestampUpdated
        presignedDataUrl
      }
    }
  }
`

export const GET_DATAPOINTS_BY_DATASET = gql`
  query datapointsByDataset($datasetName: String!, $page: Int, $pageSize: Int) {
    datapointsByDataset(
      datasetName: $datasetName
      page: $page
      pageSize: $pageSize
    ) {
      page
      pages
      count
      datapoints {
        id
        dataFile
        dataType
        annotation
        annotationType
        dataSourcePrimary
        dataSourceSecondary
        streamId
        timestampCreated
        timezone
        timestampIndexed
        timestampUpdated
        datasplits {
          id
          datasplitName
        }
        presignedDataUrl
      }
    }
  }
`

export const GET_DATAPOINT_COUNT_BY_DATASET = gql`
  query datapointsByDataset($datasetName: String!, $page: Int, $pageSize: Int) {
    datapointsByDataset(
      datasetName: $datasetName
      page: $page
      pageSize: $pageSize
    ) {
      count
    }
  }
`
