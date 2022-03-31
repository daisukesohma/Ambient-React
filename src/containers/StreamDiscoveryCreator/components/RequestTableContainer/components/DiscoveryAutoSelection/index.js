import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import useHover from '@react-hook/hover'

import {
  useCursorStyles,
  useFlexStyles,
} from '../../../../../../common/styles/commonStyles'

import useStyles from './styles'

function DiscoveryAutoSelection({ handleOptionOne, handleOptionTwo }) {
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const [isHoveringOne, refOne] = useHover()
  const [isHoveringTwo, refTwo] = useHover()
  const classes = useStyles({ isHoveringOne, isHoveringTwo })

  return (
    <div
      className={clsx(flexClasses.column, flexClasses.centerAll)}
      style={{ height: '60vh' }}
    >
      <div className={classes.gridRoot}>
        <Grid container>
          <Grid xs={0} sm={0} md={1} item />
          <Grid xs={12} sm={12} md={11} lg={11} item>
            <div className={classes.headerDescription}>
              <span className='am-h5'>
                Choose to discover cameras with a list of your own IPs, or for
                Ambient to scan your network for cameras.
              </span>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={0} sm={0} md={1} item />
          <Grid xs={12} sm={12} md={4} lg={4} item onClick={handleOptionOne}>
            <div
              ref={refOne}
              className={clsx(
                classes.choiceRoot,
                cursorClasses.pointer,
                flexClasses.column,
                flexClasses.centerAll,
              )}
            >
              <div
                className={clsx(
                  'am-h5',
                  classes.choiceTitle,
                  classes.choiceTitleOne,
                )}
              >
                Add Cameras Manually
              </div>
              <div className={clsx('am-h5', classes.choiceDescription)}>
                I have IP Addresses for my Cameras.
              </div>
              <div className={clsx('am-overline', classes.choiceSubTextOne)}>
                (Recommended) This will be the fastest way to add cameras. You
                can add by CSV file or one by one.
              </div>
            </div>
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={1}
            lg={1}
            item
            justify='center'
            alignItems='center'
          >
            <div
              className={clsx(
                flexClasses.column,
                flexClasses.centerAll,
                classes.centerColumn,
              )}
            >
              <span className={clsx('am-overline', classes.centerText)}>
                or
              </span>
            </div>
          </Grid>
          <Grid xs={12} sm={12} md={4} lg={4} item onClick={handleOptionTwo}>
            <div
              ref={refTwo}
              className={clsx(
                classes.choiceRoot,
                cursorClasses.pointer,
                flexClasses.column,
                flexClasses.centerAll,
              )}
            >
              <div
                className={clsx(
                  'am-h5',
                  classes.choiceTitle,
                  classes.choiceTitleTwo,
                )}
              >
                Automatic Scan
              </div>
              <div className={clsx('am-h5', classes.choiceDescription)}>
                I don't know the IP addresses.
              </div>
              <div className={clsx('am-overline', classes.choiceSubTextTwo)}>
                We'll do the heavy lifting, but it may take awhile to scan your
                network.
              </div>
            </div>
          </Grid>
          <Grid xs={0} sm={0} md={2} item />
        </Grid>
      </div>
    </div>
  )
}

DiscoveryAutoSelection.propTypes = {
  handleOptionOne: PropTypes.func,
  handleOptionTwo: PropTypes.func,
}

DiscoveryAutoSelection.defaultProps = {
  handleOptionOne: () => {},
  handleOptionTwo: () => {},
}

export default DiscoveryAutoSelection
