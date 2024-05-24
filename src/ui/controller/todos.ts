import { todoRepository } from "@ui/repository/todos";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod"

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
    onSuccess: (todo: Todo) => void;
    onError: () => void;
}
function create({ content, onSuccess, onError }: todoControllerCreateParams) {
    // Fail fast validation
    const parsedParams = schema.string().min(1).safeParse(content);
    if (!parsedParams.success) {
        onError();
        return
    }

    todoRepository.createWithContent(parsedParams.data)
        .then((newTodo) => {
            onSuccess(newTodo);
        })
        .catch(() => {
            onError();
        });
};

type TodoControllerToggleDoneParams = {
    id: string,
    onError: () => void,
    updateTodoOnScreen: () => void,
}
function toggleDone({ id, onError, updateTodoOnScreen}: TodoControllerToggleDoneParams) {
    // Optimistic update - we update the UI before the server responds with the expected state
    // updateTodoOnScreen(); 

    // Update real
    todoRepository.toggleDone(id).then(() => {
        updateTodoOnScreen();         
    })
    .catch(() => {
        onError();
    })
}

export const todoController = {
    get, 
    searchTodos,
    create,
    toggleDone,
};
