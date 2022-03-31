import React, { useMemo, useCallback } from 'react';
import { Group } from "@vx/group";
import { GridRows, GridColumns } from '@vx/grid';
import { scaleTime, scaleLinear } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { LinePath } from "@vx/shape";
import { curveLinear } from "@vx/curve";
import { useTooltip, TooltipWithBounds, defaultStyles } from '@vx/tooltip';

import {
  LineDataProps,
  getX,
  getY,
  getAllData,
  getRamdomColor,
} from '../../utils'

type TooltipData = LineDataProps

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
}

interface LineChartProps {
  series: [],
  width: number,
  height: number,
  margin?: { 
    top: number, 
    right: number, 
    bottom: number, 
    left: number 
  },
};

const defaultProps = {
  series: [],
  width: 676,
  height: 400,
  margin: { 
    top: 0, 
    right: 0, 
    bottom: 0, 
    left: 0 
  },
}

const LineChart = ({
  series,
  width,
  height,
  margin,
  // event,
}: LineChartProps): JSX.Element => {
  const {
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const allData = getAllData(series)

  // bounds
  const xMax = width - margin.left - margin.right - 120;
  const yMax = height - margin.top - margin.bottom - 80;

  const xScale =  useMemo(
    () =>
      scaleTime<number>({
        rangeRound: [0, xMax * 0.95],
        domain: [Math.min(...allData.map(getX)), Math.max(...allData.map(getX))]
      }),
    [xMax],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        rangeRound: [0, yMax],
        domain: [Math.max(...allData.map(getY)) * 1.2, 0],
        nice: true,
      }),
    [yMax],
  );

  return (
    <div>
      <svg width={width} height={height}>
        <Group top={25} left={65}>
          <GridRows 
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke='#808080'
            strokeDasharray="3,6"
            numTicks={5}
          />
          <GridColumns 
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke='#808080'
            strokeDasharray="3,6"
            numTicks={4}
          />
          <AxisLeft
            hideTicks
            hideAxisLine
            scale={yScale}
            numTicks={5}
            left={-10}
            tickLabelProps={(e) => ({
              fill: '#02070D',
              fontSize: 14,
              fontFamily: 'Aeonik-regular',
              letterSpacing: 0.15,
              dy: '0.33em',
              textAnchor: 'end',
            })}
          />
          <AxisBottom
            hideTicks
            hideAxisLine
            scale={xScale}
            top={yMax}
            numTicks={4}
            tickLabelProps={(e) => ({
              fill: '#02070D',
              fontSize: 14,
              fontFamily: 'Aeonik-regular',
              letterSpacing: 0.15,
              dy: '0.33em',
              textAnchor: 'middle',
            })}
          />
          {series.map((lineData: [], i) => {
            return (
              <Group key={`lines-${i}`} left={13}>
                {lineData.map((d: LineDataProps, j: number) => (
                  <circle
                    key={i + j}
                    r={10}
                    cx={xScale(getX(d))}
                    cy={yScale(getY(d))}
                    stroke="rgba(33,33,33,0.5)"
                    fill="transparent"
                    onClick={(e) => {
                      console.log(e)
                    }}
                    onMouseLeave={() => hideTooltip()}
                    onMouseMove={(e) => {
                      showTooltip({
                        tooltipData: d,
                        tooltipLeft: e.clientX,
                        tooltipTop: e.clientY,
                      });
                    }}
                  />
                ))}
                <LinePath
                  curve={curveLinear}
                  data={lineData}
                  x={(d: LineDataProps) => xScale(getX(d)) ?? 0}
                  y={(d: LineDataProps) => yScale(getY(d)) ?? 0}
                  stroke={getRamdomColor(i)}
                  strokeWidth={2}
                />
              </Group>
            );
          })}
        </Group>
      </svg>
      {tooltipData && (
        <TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>asdfsdf</strong>
          </div>
          <div>
            <small>asdfdf</small>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

LineChart.defaultProps = defaultProps
export default LineChart
