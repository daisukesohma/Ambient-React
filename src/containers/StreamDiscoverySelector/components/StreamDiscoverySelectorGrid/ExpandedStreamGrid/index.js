import React, { useRef, useEffect, useState } from 'react'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import useResizeAware from 'react-resize-aware'
import { easePolyOut } from 'd3-ease'
import get from 'lodash/get'
import { useSelector } from 'react-redux'
import { animated, useTransition, useSpring, useChain } from 'react-spring'
import { Icon } from 'react-icons-kit'
import { chevronRight } from 'react-icons-kit/feather/chevronRight'

import StreamInformationCard from '../../StreamInformationCard'
import IpInformationCard from '../../IpInformationCard'
import constants from '../../../constants'

import useStyles from './styles'

export default function ExpandedStreamList() {
  const classes = useStyles()
  const [resizeListener, sizes] = useResizeAware()
  const [rootWidth, setRootWidth] = useState()

  const expandedIp = useSelector(state =>
    get(state, 'streamDiscovery.expandedIp', null),
  )

  useEffect(() => {
    if (sizes.width && !rootWidth) {
      setRootWidth(sizes.width)
    }
  }, [sizes, rootWidth])
  const springRef = useRef()
  const { size, opacity, ...rest } = useSpring({
    ref: springRef,

    from: {
      size: '0%',
      opacity: 0,
    },
    to: {
      size: expandedIp ? '100%' : '0%',
      opacity: expandedIp ? 1 : 0,
    },
  })

  const transRef = useRef()
  const transitions = useTransition(
    expandedIp ? expandedIp.streamRequests : [],
    item => item && item.id,
    {
      ref: transRef,
      unique: true,
      trail: 150,
      from: { opacity: 0, width: '0%' },
      enter: { opacity: 1, width: '100%' },
      leave: { opacity: 0, width: '0%' },
      config: { duration: 150, easing: easePolyOut },
    },
  )

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(expandedIp ? [springRef, transRef] : [transRef, springRef], [
    0,
    expandedIp ? 0.1 : 0.6,
  ])

  // could use https://www.npmjs.com/package/react-element-scroll-hook for Fab button
  //
  return (
    <div style={{ width: rootWidth ? rootWidth - 48 : 'initial' }}>
      {resizeListener}
      {expandedIp && (
        <Grid
          container
          key={`groupedIp-${expandedIp ? expandedIp.ip : ''}`}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          spacing={2}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            style={{
              minWidth: constants.minWidth,
              maxWidth: constants.maxWidth,
            }}
          >
            <IpInformationCard
              data={expandedIp}
              streams={expandedIp.streamRequests}
            />
          </Grid>
          <Grid item xs={0} sm={6} md={8} lg={9} xl={9} />
        </Grid>
      )}
      <div className={classes.listContainer}>
        <animated.div
          className={classes.container}
          style={{ ...rest, width: size, height: size, opacity }}
        >
          <GridList
            className={classes.gridList}
            cols={4}
            style={{ height: 'fit-content' }}
          >
            {transitions.map(({ item, key, props }) => {
              if (!item) return false
              return (
                <GridListTile
                  className={classes.gridListTile}
                  key={get(item, 'id')}
                >
                  <animated.div
                    className={classes.rootItem}
                    key={key}
                    style={{ ...props }}
                  >
                    {item && <StreamInformationCard data={item} />}
                  </animated.div>
                </GridListTile>
              )
            })}
          </GridList>
        </animated.div>
        {false && expandedIp && expandedIp.streamRequests.length >= 4 && (
          <div className={classes.fabContainer}>
            <Fab
              color='primary'
              variant='round'
              classes={{ root: classes.fabRoot }}
            >
              <div className={classes.fabIconColor}>
                <Icon icon={chevronRight} size={24} />
              </div>
            </Fab>
          </div>
        )}
      </div>
    </div>
  )
}
