import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import { useSelector } from 'react-redux'

const useStyles = makeStyles(({ palette }) => ({
  title: {
    width: 200,
    height: 40,
    backgroundColor: palette.grey[400],
    marginTop: 16,
  },
  createBtn: {
    width: 100,
    height: 60,
    backgroundColor: palette.grey[400],
  },
  tableRow: {
    width: '100%',
    height: 50,
    backgroundColor: palette.grey[400],
    margin: '25px 0px',
  },
  tableContainer: ({ darkMode }) => ({
    padding: 17,
    backgroundColor: darkMode ? palette.common.black : palette.common.white,
    margin: '30px 0',
  }),
}))

const MembersSkeleton = () => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const renderTableSkeletons = () => {
    const arr = []
    for (let i = 0; i < 5; i++) {
      arr.push(<Skeleton className={classes.tableRow} />)
    }
    return arr
  }
  return (
    <div className='App'>
      <div className='row'>
        <div className='col-lg-12 m-t-sm'>
          <Skeleton className={classes.title} />
        </div>
      </div>
      <Paper className={classes.tableContainer}>{renderTableSkeletons()}</Paper>
      <Skeleton className={classes.createBtn} />
    </div>
  )
}

export default MembersSkeleton
