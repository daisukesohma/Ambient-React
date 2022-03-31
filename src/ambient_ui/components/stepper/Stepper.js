import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'

import { Button } from '../index'
import StepConnector from './childs/StepConnector'
import StepIcon from './childs/StepIcon'

const useStyles = makeStyles(({ spacing, palette }) => ({
  button: {
    marginRight: spacing(1),
    fontFamily: `'Aeonik-Regular'`,
  },
  instructions: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 16,
    marginTop: spacing(1),
    marginBottom: spacing(1),
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: `'Aeonik-Regular'`,
    color: palette.common.black,
  },
  instructionsContainer: {
    backgroundColor: palette.common.white,
    borderRadius: 4,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: '',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  stepperContainer: {
    borderRadius: 4,
  },
  labelContainer: {
    fontFamily: `'Aeonik-Regular'`,
    fontSize: 14,
  },
}))

const CustomStepper = ({
  activeStep,
  showNavigation,
  steps,
  onNext,
  onBack,
  onSkip,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()
  return (
    <div>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<StepConnector />}
        className={classes.stepperContainer}
      >
        {steps.map(({ label, icon }, index) => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{ iconComponent: icon }}
              StepIconComponent={StepIcon}
            >
              <div
                className={classes.labelContainer}
                style={{
                  color:
                    index > activeStep
                      ? palette.grey[400]
                      : palette.common.black,
                }}
              >
                {label}
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className={classes.instructionsContainer}>
        <Typography className={classes.instructions}>
          {steps[activeStep].description}
        </Typography>
        {showNavigation && (
          <div className={classes.btnContainer}>
            <Button
              variant='outlined'
              disabled={activeStep === 0}
              onClick={onBack}
              className={classes.button}
            >
              Back
            </Button>
            {steps[activeStep].optional && (
              <Button
                variant='contained'
                color='primary'
                onClick={onSkip}
                className={classes.button}
              >
                Skip
              </Button>
            )}
            <Button
              variant='contained'
              color='primary'
              onClick={onNext}
              className={classes.button}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

CustomStepper.defaultProps = {
  activeStep: 0,
  showNavigation: false,
  onNext: () => {},
  onBack: () => {},
  onSkip: () => {},
}

CustomStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  step: PropTypes.number,
  showNavigation: PropTypes.bool,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  onSkip: PropTypes.func,
}

export default CustomStepper
