import React, { useState } from 'react'

import Card from '../../../Card'
import Content from '../../../Card/Content'
import FooterSingleLine from '../../../Card/FooterSingleLine'
import HeaderDoubleLine from '../../../Card/HeaderDoubleLine'
import ActionOverlay from '../../../Card/ActionOverlay'

import useStyles from './styles'

function AlertCard({
  title,
  description,
  headerTopRight,
  headerBottomRight,
  footerName,
  footerTime,
  actionOne,
  actionOneTitle,
  actionTwo,
  actionTwoTitle,
}) {
  const [isHover, setIsHover] = useState(false)
  const classes = useStyles()
  return (
    <Card>
      <HeaderDoubleLine
        title={title}
        description={description}
        topRight={headerTopRight}
        bottomRight={headerBottomRight}
      />
      <Content>
        <div
          id='alert-gif-container'
          style={{ display: 'flex', position: 'relative' }}
          onMouseOver={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onMouseEnter={() => setIsHover(true)}
          onTouchStart={() => setIsHover(true)}
        >
          <div style={{ height: 200, width: 300, marginTop: 72 }}>hello</div>
          {isHover && (
            <div id='hover-content' className={classes.overlayContainer}>
              <ActionOverlay
                actionOne={actionOne}
                actionOneTitle={actionOneTitle}
                actionTwo={actionTwo}
                actionTwoTitle={actionTwoTitle}
                type='button' // 'panel'
                layout='vertical'
              />
            </div>
          )}
        </div>
      </Content>
      <FooterSingleLine name={footerName} time={footerTime} />
    </Card>
  )
}

export default AlertCard
