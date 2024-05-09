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

export const todoController = {
    get,
};
