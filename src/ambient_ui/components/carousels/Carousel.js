import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import ErrorIcon from '@material-ui/icons/Error'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import Paper from '@material-ui/core/Paper'
import ItemsCarousel from 'react-items-carousel'

import '../design_system/Theme.css'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    padding: '17px 0 17px 17px',
    boxShadow: 'none',
    '& >div': {
      marginRight: 10,
    },
  },
  title: {
    marginBottom: 20,
  },
  round: {
    backgroundColor: palette.primary[600],
    color: palette.common.white,
    width: '24px !important',
    height: '24px !important',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    marginBottom: '3px',
  },
  roundContainerL: {
    marginLeft: 40,
  },
  roundContainerR: {
    marginRight: 40,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: `'Aeonik-Regular'`,
  },
  errorIcon: {
    marginRight: 10,
  },
}))

const Carousel = ({ items, title, noDataMsg }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const classes = useStyles()
  return (
    <Paper classes={{ root: classes.root }} style={{ height: '100%' }}>
      <h6 className={`${classes.title} am-h6`}>{title}</h6>
      {items.length > 0 ? (
        <ItemsCarousel
          // Placeholder configurations
          enablePlaceholder
          numberOfPlaceholderItems={5}
          minimumPlaceholderTime={1000}
          placeholderItem={
            <div style={{ height: 200, background: '#900' }}>Placeholder</div>
          }
          // Carousel configurations
          numberOfCards={5}
          gutter={12}
          showSlither
          firstAndLastGutter
          freeScrolling={false}
          // Active item configurations
          requestToChangeActive={setActiveItemIndex}
          activeItemIndex={activeItemIndex}
          activePosition='center'
          chevronWidth={24}
          rightChevron={
            <div className={classes.roundContainerR}>
              <div className={classes.round}>
                <KeyboardArrowRight />
              </div>
            </div>
          }
          leftChevron={
            <div className={classes.roundContainerL}>
              <div className={classes.round}>
                <KeyboardArrowLeft />
              </div>
            </div>
          }
          outsideChevron={false}
        >
          {items}
        </ItemsCarousel>
      ) : (
        <div className={classes.error}>
          <ErrorIcon color='error' className={classes.errorIcon} />
          {noDataMsg}
        </div>
      )}
    </Paper>
  )
}

Carousel.defaultProps = {
  children: [],
  title: 'Default Title',
  noDataMsg: 'No data received',
  items: [],
}

Carousel.propTypes = {
  children: PropTypes.array,
  title: PropTypes.string,
  noDataMsg: PropTypes.string,
  items: PropTypes.array,
}

export default Carousel
