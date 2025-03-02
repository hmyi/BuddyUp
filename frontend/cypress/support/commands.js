// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to mock Facebook login
Cypress.Commands.add('mockFacebookLogin', () => {
  // Intercept the Facebook token debug request
  cy.intercept('POST', 'https://18.226.163.235:8000/api/auth/facebook/', {
    statusCode: 200,
    body: {
      access: 'mock-jwt-token',
      refresh: 'mock-refresh-token'
    }
  }).as('facebookLogin');

  // Mock the JWT decode function that the app would normally use
  cy.window().then(win => {
    win.jwtDecode = () => ({
      username: 'testuser',
      email: 'test@example.com',
      user_id: 123,
      avatar_url: 'https://example.com/avatar.jpg',
      first_name: 'Test',
      last_name: 'User'
    });
  });

  // Mock protected API endpoints
  cy.intercept('GET', 'https://18.226.163.235:8000/api/events/my-events/', {
    statusCode: 200,
    body: {
      events: [
        { id: 1, title: 'Test Event 1' },
        { id: 2, title: 'Test Event 2' }
      ]
    }
  }).as('myEvents');
});