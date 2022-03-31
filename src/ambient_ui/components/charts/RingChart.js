import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { VictoryPie } from 'victory'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '200px',
    height: '200px',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 0px 5px 1px rgba(0, 0, 0, .3)',
  },
  title: {
    fontSize: '24px',
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: '12px',
    color: theme.palette.grey['900'],
    flex: 1,
    marginTop: '20px',
  },
  chart: {
    zoom: '.4',
    position: 'relative',
    flex: 1,
  },
  number: {
    fontSize: '50px',
    top: '40%',
    left: '33%',
    position: 'absolute',
  },
}))

const RingChart = ({ title, description, number }) => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <div className={classes.title}>{title}</div>
      <div className={classes.body}>
        <div className={classes.description}>{description}</div>
        <div className={classes.chart}>
          <VictoryPie
            padAngle={0}
            labelComponent={<span />}
            innerRadius={70}
            width={200}
            height={200}
            data={[
              { key: '', y: number },
              { key: '', y: 100 - number },
            ]}
            colorScale={['#19B3A6', '#EEEEEE']}
          />
          <div className={classes.number}>{`${number}%`}</div>
        </div>
      </div>
    </div>
  )
}

RingChart.defaultProps = {
  number: 0,
  title: 'Default Title',
  description: 'Default Description',
}

RingChart.propTypes = {
  number: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.number,
}

export default RingChart
