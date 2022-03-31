/* eslint-disable */
const account = 'acme' //'acme'
const site = 'account1site1' // 'SF'
const loggedInPage = `/accounts/${account}/live`

context('Ambient root', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    // Login and click
    // cy.eyesOpen({
    //   appName: 'Demo App',
    //   testName: 'Ultrafast grid demo',
    // })
    cy.get('#email').type(Cypress.env('username'))
    cy.get('#password').type(Cypress.env('password'))
    cy.get('[data-cy=login]').click()
    cy.get('p')
      .contains('Logout')
      .should('be.visible')
  })

  it('should login with UI', () => {
    // redirect to sites
    // cy.eyesCheckWindow({
    //   tag: 'Start',
    //   target: 'window',
    //   fully: true,
    // })
    cy.location('pathname').should('equal', loggedInPage)
    // .then(() => {
    // /* global window */
    // const persistedState = JSON.parse(
    //   window.localStorage.getItem('persist:root'),
    // )
    // const auth = JSON.parse(persistedState.auth)
    // expect(auth.loggedIn).to.be.false // persisted state is false if not logged in previously

    // // check persisted reducer
    // expect(auth).to.be.an('object')
    // expect(auth).to.have.keys([
    //   'accounts',
    //   'accountsLoading',
    //   'apiHost',
    //   'apiToken',
    //   'currentAccountSlug',
    //   'isSkeleton',
    //   'loggedIn',
    //   'payload',
    //   'profile',
    //   'sites',
    //   'sitesLoading',
    //   'token',
    //   'user',
    // ])

    // })
    // check redux for logged in state
    cy.window()
      .its('store')
      .invoke('getState')
      .its('auth')
      .its('loggedIn')
      .should('equal', true)
    cy.get('.am-button').contains('Alerts')
    cy.visit('/logout')
    cy.get('#email').should('be.visible')
    // cy.wait(1000)
    // cy.eyesCheckWindow({
    //   tag: 'Login Window',
    //   target: 'window',
    //   fully: true,
    // })
    // cy.eyesClose()
  })

  it('should navigate', () => {
    // cy.eyesCheckWindow({
    //   tag: 'Start',
    //   target: 'window',
    //   fully: true,
    // })
    cy.get('div')
      .contains('History')
      .click()
    cy.get('div')
      .contains('Alerts')
      .click()

    // redirect to sites page
    cy.location('pathname').should(
      'equal',
      `/accounts/${account}/history/alerts`,
    )
    cy.get('.am-h4')
      .contains('Alerts')
      .should('be.visible')
    // cy.wait(1000)
    // cy.eyesCheckWindow({
    //   tag: 'History Alerts page',
    //   target: 'window',
    //   fully: true,
    // })
    cy.visit('/logout')
    // cy.eyesClose()
  })
})
