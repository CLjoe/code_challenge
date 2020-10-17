/// <reference types="cypress" />

context('Testcase1', () => {
  beforeEach(() => {
    //Cypress.Cookies.debug(true)

    cy.visit('http://sample-website.beforeyoubid.com.au/contact')
    cy.viewport('iphone-x')
    // clear cookies again after visiting to remove
    // any 3rd party cookies picked up such as cloudflare
    cy.clearCookies()
  })

  //Testcase A
  it('should have contact us and phone numbers', () => {
    cy.get('[data-cy=header]').should('have.text', 'Contact Us');
    cy.scrollTo(0, 900);
    cy.get('.style__InformationContainer-sc-1wsspy8-6 > .style__ContactText-sc-1wsspy8-2')
    .should('contain.text', 'or click on the chat channel below.');
  })

  it('should have four input boxes', () => {
    cy.get('[data-cy=input-name] > .jss33').should('exist');
    cy.get('[data-cy=input-email] > .jss33').should('exist');
    cy.get('[data-cy=input-phone] > .jss33').should('exist');
    cy.get('[data-cy=input-message] > .jss23 > .jss33').should('exist');
  })

  //Testcase B
  it('should have a messge when user has submitted successfully', () => {
    cy.get('[data-cy=input-name] > .jss33').type('aaa');
    cy.get('[data-cy=input-email] > .jss33').type('aaa');
    cy.get('[data-cy=input-phone] > .jss33').type('12345678');
    cy.get('[data-cy=input-message] > .jss23 > .jss33').type('xxxxx');

    cy.get('.Button__ButtonWrapper-sj5hgh-0').click();
    cy.wait(1000);
    cy.get('[data-cy=message-sent]').should('exist');
  })

  //Testcase C
  it('should raise error when mandatories are missing', () => {
    // cy.get('input:invalid').should('have.length', 0);
    cy.get('.Button__ButtonWrapper-sj5hgh-0').click();
    cy.wait(1000);
    // cy.get('input:invalid').should('have.length', 3);
    cy.get(':nth-child(1) > .Input__Wrapper-sc-1kmdb1h-2 > .Input__Error-sc-1kmdb1h-5').should('have.text', 'Your name is required');
    cy.get(':nth-child(2) > .Input__Wrapper-sc-1kmdb1h-2 > .Input__Error-sc-1kmdb1h-5').should('have.text', 'Your email is required');
    cy.get('.TextArea__Error-sc-1gjtjkn-2').should('have.text', 'Did you forget to leave us a message?');

  })

  //Testcast D
  it('check validation message on invalid phone number', () => {
    cy.get('[data-cy=input-name] > .jss33').type('aaa');
    cy.get('[data-cy=input-email] > .jss33').type('1235493@gmail.com');
    cy.get('[data-cy=input-phone] > .jss33').type('not_a_phone');
    cy.get('[data-cy=input-message] > .jss23 > .jss33').type('xxxxx');

    cy.get('.Button__ButtonWrapper-sj5hgh-0').click();
    cy.wait(1000);
    cy.get('.Input__Error-sc-1kmdb1h-5').should('have.text', 'Agent Phone number is invalid');

    cy.get('[data-cy=message-sent]').should('not.exist');



  })

  Cypress.Commands.overwrite('should', (originalFn, actual, assertion, options) => {
    if (options && options.message) {
      cy.on('fail', (error, runnable) => {
        error.name = 'CustomError'
        error.message = options.message
        throw error // throw error to have test still fail
      })
    }
    return originalFn(actual, assertion, options)
  })

  it('check validation message on invalid email address', () => {
    cy.get('[data-cy=input-name] > .jss33').type('aaa');
    cy.get('[data-cy=input-email] > .jss33').type('not_an_email');
    cy.get('[data-cy=input-phone] > .jss33').type('123456789');
    cy.get('[data-cy=input-message] > .jss23 > .jss33').type('xxxxx');

    cy.get('.Button__ButtonWrapper-sj5hgh-0').click();
    cy.wait(1000);


    cy.get('[data-cy=message-sent]').then((msg) => {
      cy.wrap(msg).should('not.exist', { message: 'invaild email'});
    })
  })
})
