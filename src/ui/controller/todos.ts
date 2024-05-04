async function get() {
    return fetch("http://localhost:3000/api/todos").then(async (serverResponse) => {
            const todosString = await serverResponse.text();
            const todosFromServer = JSON.parse(todosString).todos;
            return todosFromServer;
        }
    );
}

export const todoController = {
    get,
};
