import clsx from 'clsx'

import { useFlexStyles, useCursorStyles } from './commonStyles'

// This is a helper custom hook with a list of commonly used composed classes.
// It especially helps with 'am-subtitle1' type classnames, where you'd normally have to
// clsx('am-subtitle1', classes.text) in order to compose the commonStyles
//
// Feel free to add to this list, but if you change a key, make sure all references in code
// base are changed as well!
//
export default function useCommonStyles() {
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()

  return {
    cellTextNormal: 'am-subtitle2',
    cellTextNormalPointer: clsx('am-subtitle2', cursorClasses.pointer),
    rowCenterAll: clsx(flexClasses.row, flexClasses.centerAll),
    rowCenterBetween: clsx(flexClasses.row, flexClasses.centerBetween),
  }
}
