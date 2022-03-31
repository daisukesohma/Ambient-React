export const TEST_NODE = {
  identifier: 'test_id',
  activeStreamCount: 1,
  name: 'test_name',
}

export const TEST_STREAM_DISCOVERY = {
  id: '761',
  node: {
    identifier: 'test_id',
    site: {
      id: 'test_site',
      slug: 'test_site',
      name: 'test_site',
      nodes: [TEST_NODE],
    },
  },
  requestType: 'DISCOVERY',
  status: 'completed',
  request:
    '{"can_nmap": true, "scan_onvif": true, "scan_onvif_wsd": false, "credentials": [{"username": "root", "password": "ambient"}], "capture_frame": false, "endpoints": [], "resolution": "64x64", "ports": []}',
  createdTs: '2020-05-15T23:45:12.119054+00:00',
  updatedTs: '2020-05-15T23:45:12.119099+00:00',
  streams: [],
  streamRequests: [],
}

export const TEST_STREAM = {
  id: '1769',
  cameraIp: '10.1.13.134',
  cameraMake: '',
  cameraModel: '',
  port: null,
  streamUrl: 'rtsp://root:ambient@10.1.13.134/axis-media/media.amp',
  url:
    'http://ambient-appliance-thumbnail-data-staging.s3-us-west-2.amazonaws.com/acme/36/host8/thumbnail_761_1769.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIYYITQN6YCO4Y5IQ%2F20200521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200521T024707Z&X-Amz-Expires=259200&X-Amz-SignedHeaders=host&X-Amz-Signature=cf43c80dd94b3bed6f60fb8411e6aa15eece3de500cfc99c9e34d19dad13cb40',
  streamName: '10.1.13.134',
  __typename: 'StreamDiscoveredType',
  regionId: 21,
}

export const TEST_IP = {
  ip: '10.1.13.139',
  streamRequests: [TEST_STREAM],
}

export const TEST_STREAM_REQUEST = {
  regionId: 21,
  nodeId: 'host8',
  name: '10.1.13.139',
  identifier: 'rtsp://root:ambient@10.1.13.139/axis-media/media.amp',
}
