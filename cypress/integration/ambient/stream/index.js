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

  it('video wall should show video playing', () => {
    // cy.eyesCheckWindow({
    //   tag: 'Start',
    //   target: 'window',
    //   fully: true,
    // })
    cy.visit('/accounts/acme/video-walls/257')

    cy.get('span')
      .contains('Select Template for Video Wall in Edit Mode')
      .should('not.exist')

    cy.window()
      .its('mediaStreams')
      .its('streams')
      .its('video-stream-0')
      .its('bsodDetected')
      .should('equal', undefined)

    // redirect to sites page
    // cy.location('pathname').should(
    //   'equal',
    //   `/accounts/${account}/history/alerts`,
    // )
  })
})
