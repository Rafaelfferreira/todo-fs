// MARK: - Types
type TodoRepositoryGetParams = {
    page: number;
    limit: number;
};
type TodoRepositoryGetOutput = {
    todos: Todo[];
    total: number;
    pages: number;
};

type Todo = {
    id: string;
    content: string;
    date: Date;
    done: boolean;
};

// MARK: - Functions
function get({ page, limit }: TodoRepositoryGetParams): TodoRepositoryGetOutput {
    return fetch("http://localhost:3000/api/todos").then(
        async (serverResponse) => {
            const todosString = await serverResponse.text();
            const todosFromServer = JSON.parse(todosString).todos;

            const ALL_TODOS = todosFromServer;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
            const totalPages = Math.ceil(ALL_TODOS.length / limit);

            return {
                todos: paginatedTodos,
                total: ALL_TODOS.length,
                number: totalPages,
            };
        }
    );
}

// MARK: - Exports
export const todoRepository = {
    get,
};
