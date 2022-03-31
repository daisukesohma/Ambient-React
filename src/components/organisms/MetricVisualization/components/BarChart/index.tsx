import React, { useMemo } from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisLeft, AxisRight } from '@vx/axis';
import { scaleBand, scaleLinear } from '@vx/scale';

import {
  AXIS_LEFT_WIDTH,
  AXIS_LEFT_MARGIN_LEFT,
  AXIS_RIGHT_MARGIN_RIGHT,
} from './constants'
import {
  BarDataProps,
  getKey,
  getRamdomColor,
  getValue,
  getValueWithCommas,
} from '../../utils'

interface BarChartProps {
  data: BarDataProps[],
  width: number,
  height: number,
  event: () => void,
};

const defaultProps = {
  data: [],
  width: 676,
  height: 200,
  event: () => {},
}

const BarChart = ({
  data,
  width,
  height,
  event,
}: BarChartProps): JSX.Element => {
  const handleClick = () => {
    event()
  }

  // bounds
  const xMax = width - AXIS_LEFT_WIDTH;
  const yMax = height;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, xMax * 0.55],
        domain: [0, Math.max(...data.map(getValue))],
      }),
    [xMax],
  );

  const y0Scale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, yMax],
        domain: data.map(getKey),
        padding: 0.25,
      }),
    [yMax],
  );

  const y1Scale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, yMax],
        domain: data.map(getValueWithCommas),
        padding: 0.25,
      }),
    [yMax],
  );

  return (
    <svg width={width} height={height}>
      <Group>
        {data.map((d, index) => {
          const key = getKey(d);
          const barWidth = xScale(getValue(d));
          const barHeight = y0Scale.bandwidth();
          const barY = y0Scale(key);
          return (
            <Bar
              key={`bar-${key}`}
              x={AXIS_LEFT_WIDTH}
              y={barY}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={getRamdomColor(index)}
              onClick={handleClick}
            />
          );
        })}

        <AxisLeft
          hideAxisLine
          hideTicks
          left={AXIS_LEFT_MARGIN_LEFT}
          scale={y0Scale}
          tickLabelProps={(e) => ({
            fill: '#33334D',
            fontSize: 16,
            fontFamily: 'Aeonik-regular',
            letterSpacing: 0.15,
            dy: '0.33em',
          })}
        />
        <AxisRight
          hideAxisLine
          hideTicks
          left={width - AXIS_RIGHT_MARGIN_RIGHT}
          scale={y1Scale}
          tickLabelProps={(e) => ({
            fill: '#0000FF',
            fontSize: 20,
            fontFamily: 'Aeonik-medium',
            letterSpacing: 0.15,
            textAnchor: 'end',
            dy: '0.33em',
          })}
        />
      </Group>
    </svg>
  )
}

BarChart.defaultProps = defaultProps
export default BarChart
