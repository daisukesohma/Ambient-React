import React from 'react'
import { Skeleton } from '@material-ui/lab'
// src
import useStyles from './styles'

export default function ItemSkeleton() {
  const { skeleton } = useStyles()
  return <Skeleton classes={{ root: skeleton }} animation='wave' />
}
