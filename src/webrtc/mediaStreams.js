// Global Object used to store mediaStreams. Mostly mirrors the redux/slices/webrtc slice
// except for the MediaStream object itself, which isn't serializeable. All changes to redux
// state are first applied to mediaStreams, and the redux state is only changed if the change
// succeeds (such as a webrtc signal message being sent.
// Keeps track of the count per node
const mediaStreams = {
  nodeStreamCounts: {},
  streams: {},
  p2p: null,
}

export default mediaStreams
