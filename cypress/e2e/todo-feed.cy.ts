const BASE_URL = "http://localhost:3000";

describe("/ - Todos feed", () => {
    it("renders the page after loading", () => {
        cy.visit(BASE_URL)
    })

    it.only("creates a new todo after the user submits the form", () => {
        // 0 - Intercept backend calls
        cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
            request.reply({
                statusCode: 201,
                body: {
                    todo: {
                    "id": "04acb1b4-fc0b-44c9-822c-ea84efa31429",
                    "date": "2024-06-02T16:40:41.761Z",
                    "content": "Test todo",
                    "done": false
                    }
                }
            })
        }).as("createTodo")

        // 1 - Visit the page
        cy.visit(BASE_URL);

        // 2 - Select input and type a new todo
        // const $inputAddTodo = cy.get("header > form > input"); Getting by cypress identifier
        const $inputAddTodo = cy.get("input[name='Add todo']") 
        $inputAddTodo.type("Test todo");

        // 3 - Click on the submit button
        const $btnAddTodo = cy.get("button[aria-label='Adicionar novo item']")
        $btnAddTodo.click();

        // 4 - Test if a new todo appeared on the screen
        cy.get('tbody').contains("Test todo");
    })
});
