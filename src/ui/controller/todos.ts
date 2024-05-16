import { todoRepository } from "@ui/repository/todos";

type todoControllerGetParams = {
    page: number;
};

async function get({ page }: todoControllerGetParams) {
    const teste =  todoRepository.get({
        page: page || 1,
        limit: 2,
    });
    return teste;
}

// This is how you declare a generic function on TypeScript. The <Todo> is a placeholder name for a generic
function searchTodos<Todo>(
    search: string, 
    todos: Array<Todo & { content: string }>
): Array<Todo> {
    const todosToDisplay = todos.filter((todo) => {
        const searchTermNormalized = search.toLowerCase();
        const contentNormalized = todo.content.toLowerCase();
        return contentNormalized.includes(searchTermNormalized);
    });

    return todosToDisplay;
};

type todoControllerCreateParams = {
    content?: string;
    onSuccess: (todo: any) => void;
    onError: () => void;
}
function create({ content, onSuccess, onError }: todoControllerCreateParams) {
    // Fail fast validation
    if (!content) {
        onError();
        return
    }

    // this will come from the repository
    const todo = {
        id: "12345",
        content,
        date: new Date(),
        done: false,
    };
    onSuccess(todo);
};

export const todoController = {
    get, 
    searchTodos,
    create,
};
