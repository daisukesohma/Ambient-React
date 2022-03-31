// # Needed for Tests see: [https://create-react-app.dev/docs/running-tests/#srcsetuptestsjs]

import '@testing-library/jest-dom/extend-expect'
import { setAutoFreeze } from 'immer'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

setAutoFreeze(false) // this is needed for reducer testing
// Cannot test reducer: Cannot assign to read only property

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: jest.fn() }),
  useParams: () => ({ push: jest.fn() }),
}))

configure({ adapter: new Adapter() })
