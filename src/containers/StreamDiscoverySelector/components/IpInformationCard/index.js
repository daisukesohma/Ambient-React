import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icon } from 'ambient_ui'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import { SizeMe } from 'react-sizeme'
import clsx from 'clsx'
import useHover from '@react-hook/hover'

import AnimatedValue from 'components/Animated/Value'
import Tooltip from 'components/Tooltip'
import Card from 'components/Cards/variants/BaseCard'
import FooterSingleLine from 'components/Cards/variants/BaseCard/FooterSingleLine'
import HeaderDoubleLine from 'components/Cards/variants/BaseCard/HeaderDoubleLine'
import {
  expandIp as expandIpAction,
  collapseIp as collapseIpAction,
} from '../../../../redux/streamDiscovery/actions'
import {
  useFlexStyles,
  useCursorStyles,
} from '../../../../common/styles/commonStyles'
import Thumbnail from '../Thumbnail'

import useStyles from './styles'

const IpInformationCard = ({ headerBottomRight, streams, data }) => {
  const theme = useTheme()
  const [isHovering, ref] = useHover()
  const { ip } = data
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const classes = useStyles()
  const dispatch = useDispatch()
  const expandedIp = useSelector(state =>
    get(state, 'streamDiscovery.expandedIp', null),
  )
  const streamsToCreate = useSelector(
    state => get(state, 'streamDiscovery.streamsToCreate'),
    [],
  )

  const thumbnailUrl = get(streams, '[0].url')

  const streamsOfIpSelected = streamsToCreate.filter(stream => {
    return stream.cameraIp === ip
  })

  const toggleExpandCard = () => {
    if (expandedIp) {
      dispatch(collapseIpAction())
    } else {
      dispatch(expandIpAction(data))
    }
  }

  const defaultName = `${ip} Camera`

  return (
    <SizeMe monitorHeight refreshRate={32}>
      {({ size }) => {
        return (
          <div
            ref={ref}
            onClick={toggleExpandCard}
            className={cursorClasses.pointer}
            key={`ipInfoCard-${ip}`}
          >
            <Card fullWidth hoverColor='blue'>
              <HeaderDoubleLine
                title={defaultName}
                description={ip}
                topRight={null}
                bottomRight={headerBottomRight}
              />
              {/* removed content tag */}
              {size.width && size.height && (
                <Thumbnail src={thumbnailUrl} height={size.height - 141} />
              )}

              <FooterSingleLine
                time={
                  isHovering ? (
                    <div className={clsx('am-overline', classes.hoverText)}>
                      Select
                    </div>
                  ) : null
                }
                name={
                  <div
                    className={clsx(
                      'am-overline',
                      classes.footerText,
                      flexClasses.row,
                      flexClasses.centerStart,
                    )}
                  >
                    <span
                      className={clsx('am-overline', classes.boldText)}
                      style={{ marginRight: 4 }}
                    >
                      <AnimatedValue value={streamsOfIpSelected.length} />
                    </span>
                    <span>
                      {' '}
                      of
                      {streams.length} Streams selected
                    </span>
                    <span style={{ marginTop: 4, marginLeft: 8 }}>
                      <Tooltip
                        content='Select discovered streams to add to the node'
                        placement='bottom'
                      >
                        <span>
                          <Icon
                            icon='alertCircle'
                            animate
                            color={theme.palette.grey[500]}
                            size={16}
                          />
                        </span>
                      </Tooltip>
                    </span>
                  </div>
                }
                noBorder
              />
            </Card>
          </div>
        )
      }}
    </SizeMe>
  )
}

IpInformationCard.defaultProps = {
  ip: '',
  streamName: '',
  headerBottomRight: null,
  streams: [],
  data: null,
}

IpInformationCard.propTypes = {
  ip: PropTypes.string,
  streamName: PropTypes.string,
  headerBottomRight: PropTypes.node,
  streams: PropTypes.array,
  data: PropTypes.object,
}

export default IpInformationCard
