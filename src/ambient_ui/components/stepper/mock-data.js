import React from 'react'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import RouterIcon from '@material-ui/icons/Router'
import CameraIcon from '@material-ui/icons/Camera'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import CloudDoneIcon from '@material-ui/icons/CloudDone'

export const steps = [
  {
    label: 'Add Site',
    description: 'Add a new physical site to your account',
    icon: <AddLocationIcon />,
  },
  {
    label: 'Add Ambient.ai Appliance',
    description: 'Deploy a new Ambient.ai appliance on this site',
    icon: <RouterIcon />,
  },
  {
    label: 'Configure Camera Discovery',
    description: `List all IPs, IP Ranges and Subnets and all possible ports that camera streams can be found on. Ambient.ai's Stream Discovery Service will discover your cameras.`,
    icon: <CameraIcon />,
    optional: true,
  },
  {
    label: 'Await Camera Discovery',
    description:
      'We will discover your camera streams based on IPs, ranges, subnets, and credentials provided.',
    icon: <HourglassEmptyIcon />,
  },
  {
    label: 'Select Cameras',
    description: 'Select streams to manage in Ambient.ai',
    icon: <PlaylistAddCheckIcon />,
  },
  {
    label: 'Complete',
    description: 'Congratulations! You have setup your Ambient.ai appliance.',
    icon: <CloudDoneIcon />,
  },
]
