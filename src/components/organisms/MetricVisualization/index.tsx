import React from 'react';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box'

import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import ExtraMenu from 'pages/Inventory/components/ExtraMenu'

import { BACKGROUND_COLOR } from './constants'
import {
//   DataProps,
//   OptionsProps,
  getTotalValue,
} from './utils'
import { barChartData, lineChartData, options } from './mock-data';

interface MetricVisualizationProps {
//   chartData: DataProps[],
  header: string,
  width: number,
  height: number,
};

const defaultProps = {
//   chartData: [],
  header: '',
  width: 676,
  height: 200,
}

const MetricVisualization = ({
//   chartData,
  header,
  width,
  height,
}: MetricVisualizationProps): JSX.Element => {
  return (
    <Box bgcolor={BACKGROUND_COLOR} p={2} borderRadius={8}>
      <Box
        width={1}
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box
          mr={1}
          maxWidth={0.5}
          fontFamily='Aeonik-medium'
          fontSize={20}
          letterSpacing={0.15}
        >
          {header}
          {' '}
          <Link href="#" style={{color: '#0000FF'}}>
            {getTotalValue(barChartData)}
          </Link>
        </Box>
        <Box>
          <ExtraMenu options={options} />
        </Box>
      </Box>

      {/* <Box pt={10} pb={10}>
        <BarChart data={barChartData} width={width} height={height} />
      </Box> */}
      <Box pt={4} pb={4}>
        <LineChart series={lineChartData} width={width} height={300} />
      </Box>
    </Box>
  )
}

MetricVisualization.defaultProps = defaultProps
export default MetricVisualization
