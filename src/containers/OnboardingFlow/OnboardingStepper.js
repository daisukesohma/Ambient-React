import React from 'react'
import PropTypes from 'prop-types'
import AddLocationIcon from '@material-ui/icons/AddLocation' // or LocationCityIcon
import RouterIcon from '@material-ui/icons/Router'
import CameraIcon from '@material-ui/icons/Camera'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import CloudDoneIcon from '@material-ui/icons/CloudDone'
import { Stepper } from 'ambient_ui'

const ConfigureDescription = () => {
  // TODO: Add in "How does this work?" or "Learn More" tooltip or new page or modal.
  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <span>
        Ambient.ai's Camera Discovery service will discover your cameras based
        on your configuration.
      </span>
      <span>
        List all IPs, IP Ranges and Subnets and all ports that camera streams
        may be found.
      </span>
      <span>
        Then, enter all username / password credentials that Ambient can
        discover camera streams on these IPs.
      </span>
    </span>
  )
}

function getSteps() {
  return [
    {
      label: 'Add Site',
      description: 'Add a new physical site to your account',
      icon: <AddLocationIcon />,
    },
    {
      label: 'Add Node',
      description: 'Deploy a new Ambient.ai node on this site',
      icon: <RouterIcon />,
    },
    {
      label: 'Configure Cameras',
      description: <ConfigureDescription />,
      icon: <CameraIcon />,
      optional: true,
    },
    {
      label: 'Discover Cameras',
      description:
        'We will discover your camera streams based on IPs, ranges, subnets, and credentials provided.',
      icon: <HourglassEmptyIcon />,
    },
    {
      label: 'Activate Cameras',
      description: 'Select camera streams to manage in Ambient.ai',
      icon: <PlaylistAddCheckIcon />,
    },
    {
      label: 'Restart Node',
      description: "You're almost there.",
      icon: <CloudDoneIcon />,
    },
  ]
}

export default function HorizontalLinearStepper({ step }) {
  const [activeStep] = React.useState(step)
  const steps = getSteps()

  return <Stepper activeStep={activeStep} steps={steps} />
}

HorizontalLinearStepper.propTypes = {
  step: PropTypes.number,
}

HorizontalLinearStepper.defaultTypes = {
  step: 0,
}
