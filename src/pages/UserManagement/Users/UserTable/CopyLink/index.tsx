import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDispatch } from 'react-redux'
import { createNotification } from 'redux/slices/notifications'
import { clipboard } from 'react-icons-kit/feather/clipboard'
import { Icon } from 'react-icons-kit'
import { Tooltip } from 'ambient_ui'

interface Props {
  inviteLink: string
}

const CopyLink: React.FC<Props> = ({ inviteLink }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const onCopy = () => {
    dispatch(createNotification({ message: 'Copied to clipboard.' }))
  }
  return (
    <Tooltip
      title='Copy Invite'
      placement='bottom'
      customStyle={{
        border: 'none',
        color: palette.common.white,
        backgroundColor: palette.common.black,
        borderRadius: 4,
        boxShadow: '0px 1px 4px rgba(34, 36, 40, 0.05)',
      }}
    >
      <CopyToClipboard text={inviteLink} onCopy={onCopy}>
        <div style={{ position: 'relative', cursor: 'pointer', width: 24 }}>
          <Icon
            icon={clipboard}
            style={{
              color: palette.grey[700],
            }}
            size={18}
          />
        </div>
      </CopyToClipboard>
    </Tooltip>
  )
}

export default CopyLink
