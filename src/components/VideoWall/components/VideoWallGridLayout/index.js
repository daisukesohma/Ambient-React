/* eslint-disable */
import React from 'react'
import { withApollo } from 'react-apollo'
import { withTheme } from '@material-ui/core/styles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { SizeMe } from 'react-sizeme'
import get from 'lodash/get'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { isMobile } from 'react-device-detect'
// src
import { Icons } from 'ambient_ui'
import Pagination from 'components/Pagination'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { ModalTypeEnum } from 'enums'
import { showModal } from 'redux/slices/modal'

import AnimateInContainer from '../AnimateInContainer'
import { GET_STREAMS } from '../../gql'
import VideoStreamComponent from 'components/VideoStreamComponent'

const { Maximize } = Icons

const ROW_HEIGHT = 1

const NUM_STREAMS_PER_ROW = 4
const NUM_STREAMS_PER_PAGE = 8

/**
 * This layout Controls the views
 */

class VideoWallGridLayout extends React.PureComponent {
  static defaultProps = {
    className: 'layout',
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: ROW_HEIGHT,
  }

  constructor(props) {
    super(props)
    this.state = {
      layout: [],
      rowHeight: ROW_HEIGHT,
      streamListOne: [],
      streamListTwo: null,
      currentPage: 1,
      pages: 1,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateRowHeight)
    this.retrieveStreams()
  }

  componentWillReceiveProps(next) {
    if (this.props.siteSlug !== next.siteSlug) {
      this.setState(
        {
          streamListOne: [],
          streamListTwo: null,
          currentPage: 1,
          pages: 1,
        },
        () => {
          this.retrieveStreams()
        },
      )
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.selectedVideoWallOption.value !==
      this.props.selectedVideoWallOption.value
    ) {
      setTimeout(() => {
        this.updateRowHeight()
      }, 1000)
    }
  }

  updateRowHeight = () => {
    if (
      this.props.selectedVideoWallOption &&
      this.props.selectedVideoWallOption.value !== null &&
      this.state.layout.length > 0
    ) {
      let elem = document.getElementById(`inner-grid-${this.state.layout[0].i}`)
      if (elem) {
        let elemHeight = elem.offsetHeight
        this.setState(
          {
            rowHeight: elemHeight,
          },
          () => {},
        )
      }
    }
  }

  // FUTURE: @eric/@rodaan onExpandFeed maybe should take data object, so not passing custom params
  // so it's more reusable
  onExpandFeed = (streamName, streamId, nodeId, siteName, timezone) => {
    // close any modals that might be open
    // show the feed modal
    const { handleOpenModal, siteSlug } = this.props
    const data = {
      content: {
        streamName,
        streamId,
        nodeId,
        siteName,
        siteSlug,
        timezone,
      },
      type: ModalTypeEnum.VIDEO,
    }
    handleOpenModal(data)
  }

  createVideoStream = (
    streamName,
    streamId,
    nodeIdentifier,
    siteName,
    key,
    timezone,
  ) => {
    const { streamType, theme } = this.props

    return (
      <Paper
        id={`live-stream-${key}`}
        key={key}
        data-pk={streamId}
        style={{
          overflow: 'hidden',
          margin: '4px',
          height: '250px',
        }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          style={{ cursor: 'pointer' }}
        >
          <Tooltip
            content={<TooltipText text={streamName} />}
            placement={'bottom-start'}
            innerSpanStyles={{
              overflowX: 'hidden',
            }}
          >
            <div
              className={'am-subtitle1'}
              style={{
                color: theme.palette.grey[700],
                margin: '8px 0 8px 16px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: 200,
              }}
              name={`stream-${streamId}`}
            >
              {streamName}
            </div>
          </Tooltip>
          <IconButton
            size='small'
            onClick={() =>
              this.onExpandFeed(
                streamName,
                streamId,
                nodeIdentifier,
                siteName,
                timezone,
              )
            }
            className='feed-popup p-xs'
            style={{
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              marginRight: 8,
            }}
          >
            <Maximize stroke={theme.palette.grey[500]} />
          </IconButton>
        </Box>
        <div
          style={{
            paddingBottom: '36px',
            height: '100%',
          }}
        >
          <VideoStreamComponent
            videoStreamKey={`sites-${streamId}`}
            accountSlug={this.props.accountSlug}
            isOnVideoWall={true}
            siteSlug={this.props.siteSlug}
            streamName={streamName}
            streamId={streamId}
            nodeId={nodeIdentifier}
            debugMode={false}
            viewMode={'JPG'}
            autoReconnectAttempts={false}
            reconnectTimeoutMs={false}
            willAutoLoad={!isMobile}
            key={`${streamName}-${streamId}-${nodeIdentifier}`}
            showPlaybackControls={false}
            streamType={streamType}
            editingVideowall={this.props.editing}
            timezone={timezone}
            isMobile={isMobile}
            showIndicator={!isMobile}
          />
        </div>
      </Paper>
    )
  }

  retrieveStreams = () => {
    const { client, accountSlug, siteSlug } = this.props
    const { currentPage } = this.state
    client
      .query({
        query: GET_STREAMS,
        variables: {
          accountSlug,
          siteSlug,
          limit: NUM_STREAMS_PER_PAGE,
          page: currentPage,
          active: true,
          incognito: false,
        },
      })
      .then(result => {
        const { instances, pages, currentPage } =
          get(result, 'data.streamsPaginated') || {}
        const { streamListOne, streamListTwo } = this.state
        if (streamListOne) {
          this.setState({
            streamListOne: null,
            streamListTwo: instances,
            pages,
          })
        }
        if (streamListTwo) {
          this.setState({
            streamListOne: instances,
            streamListTwo: null,
            pages,
          })
        }
      })
  }

  handlePageChange = e => {
    this.setState(
      {
        currentPage: e.selected + 1,
      },
      () => {
        this.retrieveStreams()
      },
    )
  }

  renderStreamList = streamList => {
    const gridSizes = {
      lg: 12 / NUM_STREAMS_PER_ROW,
      md: 12 / NUM_STREAMS_PER_ROW,
      sm: 2 * (12 / NUM_STREAMS_PER_ROW),
      xs: 12,
    }
    const list = []
    streamList.map((stream, i) => {
      if (stream) {
        const videoStream = this.createVideoStream(
          stream.name,
          stream.id,
          stream.node.identifier,
          stream.site.name,
          i.toString(),
          get(stream, 'site.timezone'),
        )

        list.push(
          <Grid
            item
            lg={gridSizes.lg}
            md={gridSizes.md}
            sm={gridSizes.sm}
            xs={gridSizes.xs}
            key={stream.id}
          >
            {videoStream}
          </Grid>,
        )
      }
    })
    return list
  }

  //
  _calculateDesktopHeightBasedOnWidth = width => {
    const DISPLAY_ASPECT_RATIO = 16 / 9
    const desktopHeight = width / DISPLAY_ASPECT_RATIO
    const minDesktopHeight = desktopHeight - 250
    const fixedHeight = 500
    return fixedHeight > minDesktopHeight ? fixedHeight : minDesktopHeight
  }

  render() {
    const { selectedVideoWallOption, streamFeeds } = this.props
    const { pages, currentPage, streamListOne, streamListTwo } = this.state

    return (
      <div style={isMobile ? { overflow: 'hidden', height: '100%' } : null}>
        {!selectedVideoWallOption.value && (
          <Pagination
            pageCount={pages}
            selectedPage={currentPage}
            pageRangeDisplayed={isMobile ? 2 : 5}
            onPageChange={this.handlePageChange}
          />
        )}
        <SizeMe>
          {({ size }) => {
            const height = this._calculateDesktopHeightBasedOnWidth(size.width)
            return (
              <div
                style={{
                  position: 'relative',
                  minHeight: isMobile ? 'calc(100% - 140px)' : height || 200,
                }}
              >
                {streamListOne && (
                  <div style={{ width: '100%' }}>
                    <AnimateInContainer from='left'>
                      <Grid container>
                        {!selectedVideoWallOption.value &&
                          this.renderStreamList(streamListOne)}
                      </Grid>
                    </AnimateInContainer>
                  </div>
                )}
                {streamListTwo && (
                  <div style={{ width: '100%' }}>
                    <AnimateInContainer from='left'>
                      <Grid container>
                        {!selectedVideoWallOption.value &&
                          this.renderStreamList(streamListTwo)}
                      </Grid>
                    </AnimateInContainer>
                  </div>
                )}
              </div>
            )
          }}
        </SizeMe>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  streamType: state.settings.streamType,
})

const mapDispatchToProps = dispatch => ({
  handleOpenModal: data => {
    dispatch(showModal(data))
  },
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withApollo,
  withTheme,
)(VideoWallGridLayout)
