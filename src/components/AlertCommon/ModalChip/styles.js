import { makeStyles } from '@material-ui/core/styles'
// src
import { DispatchStatusEnum } from 'enums'

// if you need a green, can use: https://www.sessions.edu/color-calculator-results/?colors=1881ff,5618ff,18ff97

export default makeStyles(({ spacing, palette }) => ({
  chipContainer: ({ status }) => {
    const statusBgMap = {
      [DispatchStatusEnum.AVAILABLE]: palette.secondary[50],
      [DispatchStatusEnum.SEEN]: palette.primary[50],
      [DispatchStatusEnum.REQUESTED]: palette.warning.light,
      [DispatchStatusEnum.DENIED]: palette.common.errorLightPink,
      [DispatchStatusEnum.RESOLVED]: palette.secondary[50],
      [DispatchStatusEnum.CONFIRMED]: palette.secondary[50],
      [DispatchStatusEnum.ARRIVED]: palette.secondary[50],
    }

    const statusColorMap = {
      [DispatchStatusEnum.AVAILABLE]: palette.secondary.main,
      [DispatchStatusEnum.SEEN]: palette.primary[500],
      [DispatchStatusEnum.REQUESTED]: palette.warning.main,
      [DispatchStatusEnum.DENIED]: palette.error.main,
      [DispatchStatusEnum.CONFIRMED]: palette.secondary.main,
      [DispatchStatusEnum.ARRIVED]: palette.secondary.main,
      [DispatchStatusEnum.RESOLVED]: palette.secondary.main,
    }

    return {
      '& :hover': {
        cursor: 'pointer',
      },
      background: status ? statusBgMap[status] : palette.grey[50],
      border: `1px solid ${
        status ? statusColorMap[status] : palette.grey[100]
      }`,
    }
  },
  secondaryLabel: {
    color: palette.grey[700],
  },
  ModalChipLabel: ({ status }) => {
    const statusBgMap = {
      [DispatchStatusEnum.AVAILABLE]: palette.secondary[50],
      [DispatchStatusEnum.SEEN]: palette.primary[50],
      [DispatchStatusEnum.REQUESTED]: palette.warning.light,
      [DispatchStatusEnum.DENIED]: palette.common.errorLightPink,
      [DispatchStatusEnum.RESOLVED]: palette.secondary[50],
      [DispatchStatusEnum.CONFIRMED]: palette.secondary[50],
      [DispatchStatusEnum.ARRIVED]: palette.secondary[50],
    }

    return {
      backgroundColor: status ? statusBgMap[status] : palette.grey[50],
      color: palette.common.black,
      padding: spacing(0.5),
    }
  },
}))
