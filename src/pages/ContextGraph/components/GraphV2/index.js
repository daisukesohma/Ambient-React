import React, { useRef, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { LabelledSliderSwitch } from 'ambient_ui'
import clsx from 'clsx'

import includes from 'lodash/includes'
import isEmpty from 'lodash/isEmpty'
import clone from 'lodash/clone'
import find from 'lodash/find'
import some from 'lodash/some'
import map from 'lodash/map'
import min from 'lodash/min'
import get from 'lodash/get'

import useWindowSize from 'common/hooks/useWindowSize'
import {
  // ALERTS
  threatSignaturesToggleActive,
  toggleEdges,
  // REGIONS
  regionsToggleActive,
} from '../../../../redux/contextGraph/actions'

import RegionNode from './components/RegionNode'
import ThreatNode from './components/ThreatNode'
import LogoAnimateSvg from './components/LogoAnimateSvg'
import { CIRCLE_STEP, X_TEXT_OFFSET, TEXT_MULTIPLIER } from './constants'
import useStyles from './styles'

const GraphV2 = ({ regions, alerts, relations }) => {
  const graphRef = useRef(null)
  const dispatch = useDispatch()

  const hoveredThreatSignature = useSelector(
    state => state.contextGraph.hoveredAlert,
  )
  const activeThreatSignature = useSelector(
    state => state.contextGraph.activeAlert,
  )

  const hoveredRegion = useSelector(state => state.contextGraph.hoveredRegion)
  const activeRegion = useSelector(state => state.contextGraph.activeRegion)
  const showEdges = useSelector(state => get(state, 'contextGraph.showEdges'))
  const handleToggleEdges = () => {
    dispatch(toggleEdges())
  }
  const classes = useStyles({ showEdges })

  const graphSize = useWindowSize(graphRef)

  const centerY = useCallback(() => graphSize[0] / 2, [graphSize])
  const centerX = useCallback(() => graphSize[1] / 2, [graphSize])

  const determineCoordinates = useCallback(
    (nodes, type) => {
      if (!graphSize.length) return false

      const step = CIRCLE_STEP[type]
      const xTextOffset = X_TEXT_OFFSET[type]
      const textRadiusMultiplier = TEXT_MULTIPLIER[type]
      const halfOfScreen = min(graphSize) / 2
      const circleRadius = halfOfScreen * step
      const nodesCount = nodes.length

      return map(nodes, (node, i) => {
        const resultNode = clone(node, true)
        const angle = (i / (nodesCount / 2)) * Math.PI
        resultNode.cx = circleRadius * Math.cos(angle) + centerX()
        resultNode.cy = circleRadius * Math.sin(angle) + centerY()
        resultNode.cxText =
          textRadiusMultiplier * circleRadius * Math.cos(angle) +
          centerX() -
          xTextOffset
        resultNode.cyText =
          textRadiusMultiplier * circleRadius * Math.sin(angle) + centerY() + 4
        return resultNode
      })
    },
    [graphSize, centerX, centerY],
  )

  const regionNodes = useMemo(() => determineCoordinates(regions, 'region'), [
    determineCoordinates,
    regions,
  ])

  const threatSignatureNodes = useMemo(
    () => determineCoordinates(alerts, 'threat_signature'),
    [determineCoordinates, alerts],
  )

  const getEffectDeps = useCallback(
    effect => {
      const threatSignatureDeps = [activeThreatSignature]
      const regionDeps = [activeRegion]
      if (effect === 'hover') {
        threatSignatureDeps.push(hoveredThreatSignature)
        regionDeps.push(hoveredRegion)
      }
      return { threatSignatureDeps, regionDeps }
    },
    [
      activeRegion,
      hoveredRegion,
      hoveredThreatSignature,
      activeThreatSignature,
    ],
  )

  const renderLines = useCallback(() => {
    return map(relations, (relation, index) => {
      const threatSignature = find(threatSignatureNodes, {
        id: relation.threatSignatureId,
      })
      const region = find(regionNodes, { id: relation.regionId })

      if (isEmpty(threatSignature) || isEmpty(region)) return false

      return (
        <line
          key={`line-${index}`}
          x1={threatSignature.cx}
          y1={threatSignature.cy}
          x2={region.cx}
          y2={region.cy}
          className={clsx(classes.lineStyles, {
            showEdges,
            active:
              activeRegion === region.id ||
              activeThreatSignature === threatSignature.id,
            isHovered:
              hoveredRegion === region.id ||
              hoveredThreatSignature === threatSignature.id,
          })}
        />
      )
    })
  }, [
    relations,
    threatSignatureNodes,
    regionNodes,
    activeRegion,
    activeThreatSignature,
    hoveredRegion,
    hoveredThreatSignature,
    classes.lineStyles,
    showEdges,
  ])

  const isThreatSignature = useCallback(
    (threatSignatureNode, effect) => {
      const { threatSignatureDeps, regionDeps } = getEffectDeps(effect)

      if (includes(threatSignatureDeps, threatSignatureNode.id)) return true

      return some(relations, relation => {
        return (
          includes(regionDeps, relation.regionId) &&
          relation.threatSignatureId === threatSignatureNode.id
        )
      })
    },
    [relations, getEffectDeps],
  )

  const isActiveRegion = useCallback(
    (region, effect) => {
      const { threatSignatureDeps, regionDeps } = getEffectDeps(effect)

      if (includes(regionDeps, region.id)) return true

      return some(relations, relation => {
        return (
          includes(threatSignatureDeps, relation.threatSignatureId) &&
          relation.regionId === region.id
        )
      })
    },
    [relations, getEffectDeps],
  )

  const onGraphClick = () => {
    if (activeRegion) dispatch(regionsToggleActive(null))
    if (activeThreatSignature) dispatch(threatSignaturesToggleActive(null))
  }

  const onRegionClick = (event, regionId) => {
    event.stopPropagation()
    dispatch(regionsToggleActive(regionId))
    dispatch(threatSignaturesToggleActive(null))
  }

  const onThreatSignatureClick = (event, threatSignatureId) => {
    event.stopPropagation()
    dispatch(threatSignaturesToggleActive(threatSignatureId))
    dispatch(regionsToggleActive(null))
  }

  return (
    <div ref={graphRef} className={classes.root} onClick={onGraphClick}>
      <div style={{ position: 'absolute', bottom: 40, right: '25%' }}>
        <span className={clsx('am-overline', classes.edgeText)}>
          View All Edges
        </span>
        <LabelledSliderSwitch
          checked={showEdges}
          onClick={handleToggleEdges}
          darkIconContent='On'
          lightIconContent='Off'
        />
      </div>
      <svg className={classes.svgBasis}>
        {graphSize.length && (
          <g>
            {graphSize.length ? (
              <LogoAnimateSvg x={centerX()} y={centerY()} size={110} />
            ) : (
              false
            )}
            {threatSignatureNodes.length && regionNodes.length
              ? renderLines()
              : false}

            {regionNodes.length
              ? map(regionNodes, (node, index) => (
                  <RegionNode
                    data={node}
                    isActive={isActiveRegion(node, 'active')}
                    isHovered={isActiveRegion(node, 'hover')}
                    key={`regionNode-${index}`}
                    onClick={onRegionClick}
                  />
                ))
              : false}

            {threatSignatureNodes.length
              ? map(threatSignatureNodes, (node, index) => (
                  <ThreatNode
                    data={node}
                    isActive={isThreatSignature(node, 'active')}
                    isHovered={isThreatSignature(node, 'hover')}
                    key={`threatNode-${index}`}
                    onClick={onThreatSignatureClick}
                  />
                ))
              : false}
          </g>
        )}
      </svg>
    </div>
  )
}

GraphV2.propTypes = {
  regions: PropTypes.array,
  alerts: PropTypes.array,
  relations: PropTypes.array,
}

export default GraphV2
