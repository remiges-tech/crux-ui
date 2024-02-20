describe('Workflows list', () => {


    it('Show worflow list details', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3003/bre-schema-get?app=Forex&slice=4&class=domesticrouting',
        }).as('schemaDetails')
        cy.visit('/')
        cy.selectValueFromDropdown('#app', 'Forex')
        cy.selectValueFromDropdown('#slice', '4')
        cy.selectValueFromDropdown('#class', 'domesticrouting')
        cy.wait('@schemaDetails').then((interception: any) => {
            if (interception?.response?.body?.data == null || interception?.response?.body?.data == undefined || Object.keys(interception?.response?.body?.data).length == 0) {
                cy.get('.toast-title').should('have.text', ' Error ')
                cy.get('.toast-message').should('contain', 'Data not found!')
                cy.get('#schema').contains('Details for the selected schema not found.')
            }
        }
        )
        cy.get('#rulesets-tab').click();
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3003/bre-rulesets-list',
        }).as('workflowlist')
        cy.get('#worflowName').contains('newmemberchk')
        // cy.wait('@workflowlist').then((interception:any) => {
        //     if(interception?.response?.body?.data?.rulesets == null || interception?.response?.body?.data?.rulesets == null || interception?.response?.body?.data?.rulesets.length == 0){
        //         cy.get('.toast-title').should('have.text', ' Error ')
        //         cy.get('.toast-message').should('contain', 'Data not found!')
        //         cy.get('#rulesets').contains('No Workflow list present.')
        //     }
        // })
    })
});
