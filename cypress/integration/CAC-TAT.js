/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000
    beforeEach(function() {
    //cy.visit('../../src/index.html')
    cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, '
        
        cy.clock()

        cy.get('#firstName').type('Camila')
        cy.get('#lastName').type('Santana')
        cy.get('#email').type('ca_santana_@hotmail.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()
        
        cy.get('#firstName').type('Camila')
        cy.get('#lastName').type('Santana')
        cy.get('#email').type('ca_santana_@hotmail,com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-númerico', function() {
        cy.get('#phone')
          .type('abcdefghij')
          .should('have.value', '')
        
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()
        
        cy.get('#firstName').type('Camila')
        cy.get('#lastName').type('Santana')
        cy.get('#email').type('ca_santana_@hotmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')

    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type('Camila')
            .should('have.value', 'Camila')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Santana')
            .should('have.value', 'Santana')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('ca_santana_@hotmail.com')
            .should('have.value', 'ca_santana_@hotmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('123456789')
            .should('have.value', '123456789')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.clock()
        
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.clock()
        
        cy.filMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function(){
        //cy.get('select').select('Blog')
        //cy.get('select').select('Cursos')
        //cy.get('select').select('Mentoria')
        cy.get('#product')
        .select('YouTube') // Seleção pelo texto
        .should('have.value', 'youtube')

        //cy.get('select').select('youtube') //Seleção pelo value
        //cy.get('select').select(4) // Seleção pelo índice
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
       cy.get('#product')
       .select('mentoria') 
       .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product')
        .select(1) 
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]').check()
        .should('have.value', 'feedback')
    })

    // it('marca cada tipo de atendimento', function(){
    //     cy.get('input[type="radio"][value="feedback"]')
    //     .check()
    //     .should('have.value', 'feedback')

    //     cy.get('input[type="radio"][value="elogio"]')
    //     .check()
    //     .should('have.value', 'elogio')

    //     cy.get('input[type="radio"][value="ajuda"]')
    //     .check()
    //     .should('have.value', 'ajuda')
    // })

        it('marca cada tipo de atendimento', function(){
            cy.get('input[type="radio"]')
                .should('have.length', 3)
                .each(function($radio) {
                    cy.wrap($radio).check()
                    cy.wrap($radio).should('be.checked')

            })
        })

        it('marca ambos checkboxes, depois desmarca o último', function() {
            cy.get('input[type="checkbox"]')
            .check()
            .last()
            //.first()
            .uncheck()
            .should('not.be.checked')
        })

        it('seleciona um arquivo da pasta fixtures', function () {
            cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
        })

        it('seleciona um arquivo simulando um drag-and-drop', function () {
            cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop' })
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')

        })
    })

        it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
            cy.fixture('example.json').as ('sampleFile')
            cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
        })

        it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
            cy.get('#privacy a').should('have.attr', 'target', '_blank')
        })

        // //Camila
        // it('testa que a política de privacidade abre em outra clicando no link' , function () {
        //     cy.get('a')
        //     .click()
        // })

        it('testa a página da política de privavidade de forma independente' , function () {
            cy.visit('./src/privacy.html')

            cy.contains('Talking About Testing').should('be.visible')
        })
        
        
        it('acessa a página da política de privacidade removendo o target e então clicanco no link', function () {
            cy.get('#privacy a')
                .invoke('removeAttr', 'target')
                .click()
            
            cy.contains('Talking About Testing').should('be.visible')
        })


})