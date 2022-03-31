//
// https://www.npmjs.com/package/@casl/react
// https://github.com/stalniy/casl/tree/master/packages/casl-react
import { createContext } from 'react'
import { createContextualCan } from '@casl/react'

export const AbilityContext = createContext()
export const Can = createContextualCan(AbilityContext.Consumer)
