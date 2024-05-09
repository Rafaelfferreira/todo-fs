import { read } from "@db-crud-todo";

type TodoRepositoryGetParams = {
    page?: number;
    limit?: number;
};

type TodoRepositoryGetOutput = {
    total: number;
    todos: Todo[];
    pages: number;
}

function get({ page, limit }: TodoRepositoryGetParams = {}) {
    const currentPage = page || 1;
    const currentLimit = limit || 2;

    const ALL_TODOS = read();

    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = currentPage * currentLimit;
    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

    return {
        total: ALL_TODOS.length,
        todos: paginatedTodos,
        pages: totalPages
    }
}

export const todoRepository = {
    get,
};

//Model/Schema
type Todo = {
    id: string;
    content: string;
    date: string;
    done: boolean;
}
