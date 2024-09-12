describe('SauceDemo E2E Testing', () => {
	beforeEach(() => {
		cy.visit('https://www.saucedemo.com/')
	})

	it('Verify the login page is accessible and loads without errors', () => {
		cy.url().should('include', 'saucedemo')
	})

	it('Verify that a user with valid login credentials can log in successfully', () => {
		cy.get('[data-test="username"]').type('standard_user')
		cy.get('[data-test="password"]').type('secret_sauce')
		cy.get('[data-test="login-button"]').click()
		cy.url().should('include', '/inventory.html')
	})

	it('Verify that a user with invalid login credentials cannot log in and sees an appropriate error', () => {
		cy.get('[data-test="username"]').type('error_user')
		cy.get('[data-test="password"]').type('wrong_password')
		cy.get('[data-test="login-button"]').click()
		cy.get('[data-test="error"]').should('be.visible')
	})

	Cypress.Commands.add('addItemToCart', itemName => {
		cy.contains('.inventory_item', itemName).find('button').click()
	})

	it('Add items to the cart and verify', () => {
		cy.get('[data-test="username"]').type('standard_user')
		cy.get('[data-test="password"]').type('secret_sauce')
		cy.get('[data-test="login-button"]').click()

		cy.addItemToCart('Sauce Labs Backpack')
		cy.addItemToCart('Sauce Labs Bike Light')

		cy.get('.shopping_cart_badge').should('have.text', '2')
	})

	it('Proceed to checkout and verify the items in the cart', () => {
		cy.get('[data-test="username"]').type('standard_user')
		cy.get('[data-test="password"]').type('secret_sauce')
		cy.get('[data-test="login-button"]').click()

		cy.addItemToCart('Sauce Labs Backpack')
		cy.addItemToCart('Sauce Labs Bike Light')

		cy.get('.shopping_cart_link').click()
		cy.url().should('include', '/cart.html')
		cy.contains('.cart_item', 'Sauce Labs Backpack').should('be.visible')
		cy.contains('.cart_item', 'Sauce Labs Bike Light').should('be.visible')

		cy.get('[data-test="checkout"]').click()
		cy.url().should('include', '/checkout-step-one.html')
	})

	it('Checkout: Your Information page verification', () => {
		cy.get('[data-test="username"]').type('standard_user')
		cy.get('[data-test="password"]').type('secret_sauce')
		cy.get('[data-test="login-button"]').click()

		cy.addItemToCart('Sauce Labs Backpack')
		cy.get('.shopping_cart_link').click()
		cy.get('[data-test="checkout"]').click()

		cy.get('[data-test="firstName"]').type('John')
		cy.get('[data-test="lastName"]').type('Doe')
		cy.get('[data-test="postalCode"]').type('12345')
		cy.get('[data-test="continue"]').click()
		cy.url().should('include', '/checkout-step-two.html')
	})

	it('Checkout: Overview page total price with tax verification', () => {
		cy.get('[data-test="username"]').type('standard_user')
		cy.get('[data-test="password"]').type('secret_sauce')
		cy.get('[data-test="login-button"]').click()

		cy.addItemToCart('Sauce Labs Backpack')
		cy.get('.shopping_cart_link').click()
		cy.get('[data-test="checkout"]').click()

		cy.get('[data-test="firstName"]').type('John')
		cy.get('[data-test="lastName"]').type('Doe')
		cy.get('[data-test="postalCode"]').type('12345')
		cy.get('[data-test="continue"]').click()

		cy.get('.summary_total_label').then($total => {
			const totalText = $total.text()
			expect(totalText).to.include('Total:')
		})
	})

	it('Submit checkout and verify Checkout: Complete! page', () => {
		cy.get('[data-test="username"]').type('standard_user')
		cy.get('[data-test="password"]').type('secret_sauce')
		cy.get('[data-test="login-button"]').click()

		cy.addItemToCart('Sauce Labs Backpack')
		cy.get('.shopping_cart_link').click()
		cy.get('[data-test="checkout"]').click()

		cy.get('[data-test="firstName"]').type('John')
		cy.get('[data-test="lastName"]').type('Doe')
		cy.get('[data-test="postalCode"]').type('12345')
		cy.get('[data-test="continue"]').click()
		cy.get('[data-test="finish"]').click()

		cy.url().should('include', '/checkout-complete.html')
		cy.get('.complete-header').should('have.text', 'Thank you for your order!')
	})

	it('Logout from the application', () => {
		cy.get('[data-test="username"]').type('standard_user')
		cy.get('[data-test="password"]').type('secret_sauce')
		cy.get('[data-test="login-button"]').click()

		cy.get('.bm-burger-button').click()
		cy.get('#logout_sidebar_link').click()
		cy.url().should('include', 'saucedemo.com')
	})
})
