import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import SiteSelector from '../SiteSelector'

const StreamEditorHelper = ({ accountSlug }) => {
  const [site, setSite] = useState(null)
  return (
    <Box>
      <Box>
        {!site ? (
          <Typography variant='caption'>
            Select a site to get started
          </Typography>
        ) : (
          <Typography variant='caption'>
            You are now configuring
            {site.name}
          </Typography>
        )}
      </Box>
      <Box>
        <SiteSelector
          accountSlug={accountSlug}
          onChange={option =>
            setSite({
              id: option.value,
              name: option.label,
            })
          }
        />
      </Box>
    </Box>
  )
}

export default StreamEditorHelper
