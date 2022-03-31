# Front-end (FE) part of Ambient product
The new fully reactified frontend

# Required packages for FE development
`npm -v` **7** (major version of [NPM](https://www.npmjs.com/)) 

`node -v` **16** (major version of [Node.JS](https://nodejs.org/))

1. Install the above version of node on Ubuntu by following the instructions [here](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions). This will install both node and npm.
1. Run `npm install` to install all dependencies.

## Main Development packages:

[Material-UI](https://material-ui.com/) - React components for faster and easier web development. Build your own design system, or start with Material Design.

**Note:** _We use Material UI Components with their API which supports most parts of CSS out of the box and it’s much more readable (instead of diving into the native styles file).
Read the documentation, know components API and use it_


[Lodash](https://lodash.com/) - A modern JavaScript utility library delivering modularity, performance & extras.

**Note:** _all of these functions are already good wrappers to save development time. Read the documentation before write custom logic/functions_


### [Code Splitting](https://reactjs.org/docs/code-splitting)

**Important:** _Use lazy import for page modules_

Example:
```
import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const Page = lazy(() => import('./Page'))

export default function ActivityLogIndex(): JSX.Element {
  return (
    <Suspense fallback={LoadingScreen}>
      <Page />
    </Suspense>
  )
}
```


## TypeScript

We are migrating our Ambient product codebase into Typescript for better grokking of code across the team and mitigating production errors.

#### IDE Type Checking
VSCode - should handle TS file type checking out of the box
Atom -
  - you will need to install https://atom.io/packages/atom-typescript `atom-typescript`
  - this also requires `atom-ide-ui` package

Type checking in your IDE is essential to avoid TS compilation issues at deploy-time. We removed the typescript compilation (previous engineer worked on TS integration into our codebase) from the `npm run start` script for faster start times in local development. However, `npm run deploy` hit typescript errors for me in Atom IDE. Install atom packages above to see these errors in the IDE.

## Folder structure

In the root folder there are 2 folders:

- **public** *Here are the public assets, images and `index.html` file.*
- **src** *Here is the main business logic of the theme.*
- **|----components** *The reusable and stand-alone components are stored here, by following [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)*
- **|----|----atoms** *These are small functional components that are not using any other atomic components*
- **|----|----molecules** *Tese are those functional components which have dependencies from other atoms*
- **|----|----organisms** *These are the functional components that are using other molecules and atoms*
- **|----layouts**
- **|----|----ApplicationLayout** *The global layout: used on all pages*
- **|----|----AuthLayout** *Auth Group Pages*
- **|----|----MobileLayout** *Mobile Alerts Group Pages*
- **|----|----SidebarLayout** *The main layout: used mostly on all pages (account and internal group)*
- **|----theme** *In this folder there are overrides of the default color palette and typography coming from MUI*
- **|----Router** *Main root-level router of the application*
- **|----utils** *set of common helper functions of the application*
- **|----pages** *All the pages that are available. Here are the combination and composition of re-usable components and pages representations.*

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

You can direct which backend to communicate portal with by specifying it like so:
`npm run start:staging`


If you want to run off of local portal, remove the .env.development file

### `npm run test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Used to run product on the staging.ambient.ai api endpoint.
Uses the .env.test

#### Unit Testing
- We use [Jest](https://create-react-app.dev/docs/running-tests/) to run unit tests. Since this application relies on Redux for state management Redux Action Creator and Reducer tests are the first unit tests to create when making any feature or change on the application.

#### Component Unit Testing

- We have setupTest.js which will setup some of the mock hook functions
  including useHistory and useParams. So if you need to add more hooks, you can
  simply add inside setupTest.js file.

  https://create-react-app.dev/docs/running-tests/#srcsetuptestsjs

  Note: Keep in mind that if you decide to "eject" before creating src/setupTests.js, the resulting package.json file won't contain any reference to it, so you should manually create the property setupFilesAfterEnv in the configuration for Jest, something like the following:
  "jest": {
    // ...
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]
  }

- We will be using @testing-library/react and @testing-library/jest-dom for the
  component testing. The reason we use these libraries is it's much faster than
  the enzyme + react-test-renderer
- redux-mock-store is used to create a mock store for rendering. Inside tests,
  you just need to create mock store data. Instead of having commong redux mock
  store setup, let's have this store setup inside each tests. Because different
  containers will need different redux sub-stores.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Used to run product on the home.ambient.ai api endpoint.
Uses the .env.production

## Deployment

1. Make sure you have aws_cli installed and have an AWS_ACCESS_TOKEN and AWS_ACCESS_SECRET setup in your local environment.
2. To deploy, update the .env.production file in the route directory with the endpoints you want to point the frontend to.
3. Ensure you have the latest npm packages installed: `npm install`
4. Deploy to the right S3 + Cloudfront instance:
`npm run deploy:alpha` --> alpha.ambient.ai
`npm run deploy:app` --> app.ambient.ai
`npm run deploy:beta` --> beta.ambient.ai
`npm run deploy:demo` --> demo.ambient.ai

## Important Branches
1. main
The main default branch. Every new branch should be based off of main. Ideally if a feature is being worked on, a feature branch is made from main. Ideally a feature branch is complete and well tested before getting merged into main. Hotfixes should be made from main as well.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### [Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
### [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
### [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
### [Deployment](https://facebook.github.io/create-react-app/docs/deployment)

maintained by [Rodaan](mailto:rodaan@ambient.ai) & [Alex](mailto:aleks@ambient.ai)
