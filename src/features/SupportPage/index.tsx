import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import map from 'lodash/map'
// src
import { Grid, Modal } from '@material-ui/core'
import Info from 'ambient_ui/components/icons/contents/Info'
import Comment from 'ambient_ui/components/icons/contents/Comment'
import { useTheme } from '@material-ui/core/styles'
import { Can } from 'rbac'

import { useStyles } from './styles'
import CreateTicketModal from './components/CreateTicketModal'
import Section from './components/Section'
import { closeModal, openModal } from './redux/supportSlice'
import AccountRequestAccessTable from './components/AccountRequestAccessTable'

export default function SupportHelpPage(): JSX.Element {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  // eslint-disable-next-line
  const classes = useStyles({ darkMode })
  const modalOpened = useSelector((state: any) => state.support.modalOpened)

  const createTicketClick = () => {
    dispatch(openModal())
  }

  const data = [
    {
      title: 'Training',
      content: [
        'Ambient Academy provides enablement videos, visual guides on the latest features, as well as Product Release notes.',
      ],
      button: 'Go To Ambient Academy',
      buttonFunction: () => {
        // noreferrer automatically sets noopener
        window.open(
          'https://ambient-academy.squarespace.com/?password=Ambient2020!',
          '_blank',
          'noreferrer',
        )
      },
      key: 'trainingSection',
      icon: (
        <Info
          stroke={darkMode ? palette.common.white : palette.common.black}
          width={18}
          height={18}
        />
      ),
    },
    {
      title: 'Contact',
      content: [
        "Couldn't find an answer to your question or need technical support?",
        "Create a support ticket here and we'll get back to you as soon as we can.",
        'Our hours are 8:00AM - 6:00PM PST Monday - Friday.',
      ],
      button: 'Create Ticket',
      buttonFunction: createTicketClick,
      key: 'contactSection',
      icon: (
        <Comment
          stroke={darkMode ? palette.common.white : palette.common.black}
          width={18}
          height={18}
        />
      ),
    },
  ]

  return (
    <Grid className={classes.root}>
      <Grid
        container
        spacing={4}
        className={classes.root}
        alignItems='flex-start'
        direction='row'
        justify='space-evenly'
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className='am-h4'>Support</div>
        </Grid>
        <Grid
          item
          container
          lg={6}
          md={6}
          sm={12}
          xs={12}
          spacing={2}
          justify='space-between'
          style={{ paddingBottom: 0 }}
        >
          {map(data, (d, index) => {
            if (index % 2 === 0) {
              return (
                <Section
                  title={get(d, 'title', null)}
                  darkMode={darkMode}
                  content={get(d, 'content', [])}
                  button={get(d, 'button', null)}
                  buttonFunction={get(d, 'buttonFunction', null)}
                  key={get(d, 'key', '')}
                  icon={get(d, 'icon', null)}
                />
              )
            }
            return null
          })}
        </Grid>
        <Grid
          item
          container
          lg={6}
          md={6}
          sm={12}
          xs={12}
          spacing={2}
          justify='space-between'
          style={{ paddingBottom: 0 }}
        >
          {map(data, (d, index) => {
            if (index % 2 !== 0) {
              return (
                <Section
                  title={get(d, 'title', null)}
                  darkMode={darkMode}
                  content={get(d, 'content', [])}
                  button={get(d, 'button', null)}
                  buttonFunction={get(d, 'buttonFunction', null)}
                  key={get(d, 'key', '')}
                  icon={get(d, 'icon', null)}
                />
              )
            }
            return null
          })}
        </Grid>
        <Modal
          open={modalOpened}
          onClose={() => {
            dispatch(closeModal())
          }}
        >
          <CreateTicketModal />
        </Modal>
      </Grid>
      <Can I='view' on='SupportAccess'>
        <AccountRequestAccessTable />
      </Can>
    </Grid>
  )
}
