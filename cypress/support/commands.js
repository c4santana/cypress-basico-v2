Cypress.Commands.add('filMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Camila')
    cy.get('#lastName').type('Santana')
    cy.get('#email').type('ca_santana_@hotmail.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
})