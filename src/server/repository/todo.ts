import { read, create } from "@db-crud-todo";

type TodoRepositoryGetParams = {
    page?: number;
    limit?: number;
};

type TodoRepositoryGetOutput = {
    total: number;
    todos: Todo[];
    pages: number;
}

function get({ page, limit }: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
    const currentPage = page || 1;
    const currentLimit = limit || 2;

    const ALL_TODOS = read().reverse();

    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = currentPage * currentLimit;
    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

    return {
        total: ALL_TODOS.length,
        todos: paginatedTodos,
        pages: totalPages
    }
};

async function createWithContent(content: string): Promise<Todo> {
    const newTodo = create(content);
    return newTodo;
};

export const todoRepository = {
    get,
    createWithContent
};

//Model/Schema
type Todo = {
    id: string;
    content: string;
    date: string;
    done: boolean;
}
