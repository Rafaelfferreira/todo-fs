import { read, create, update, deleteById as dbDeleteById } from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";
import { Todo, TodoSchema } from "@server/schema/todo";

// MARK: - Supabase config 
// TODO: - Separate it in another file
// ############################################
import { createClient } from '@supabase/supabase-js';
import { parse } from "node:path";
import { todo } from "node:test";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE__PUBLIC_KEY || ""; //handling optional to make sure it is the correct type
const supabase = createClient(supabaseUrl, supabaseKey);
// ############################################

type TodoRepositoryGetParams = {
    page?: number;
    limit?: number;
};

type TodoRepositoryGetOutput = {
    total: number;
    todos: Todo[];
    pages: number;
}

async function get({ page, limit }: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {

    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const startIndex = (currentPage-1) * currentLimit;
    const endIndex = (currentPage * currentLimit) - 1;

    const { data, error, count } = await supabase.from('todos').select("*", {
        count: 'exact'
    })
    .range(startIndex, endIndex);

    if (error) throw new Error("Failed to fetch data");

    const parsedData = TodoSchema.array().safeParse(data);

    if (!parsedData.success) {
        throw new Error("Failed to parse TODO from database");
    }

    const todos = parsedData.data;
    const total = count || todos.length;
    const totalPages = Math.ceil(total/currentLimit);

    return {
        total: total,
        todos: todos,
        pages: totalPages,
    }
};

async function createWithContent(content: string): Promise<Todo> {
    const newTodo = create(content);
    return newTodo;
};

async function toggleDone(id: string): Promise<Todo> {
    const ALL_TODOS = read();
    const todo = ALL_TODOS.find((todo) => todo.id === id);

    if(!todo) throw new Error(`Todo with id "${id}" not found.`);

    const updatedTodo = update(todo.id, {
        done: !todo.done,
    })

    return updatedTodo;
}

async function deleteById(id: string) {
    const ALL_TODOS = read();
    const todo = ALL_TODOS.find((todo) => todo.id === id);

    if (!todo) throw new HttpNotFoundError(`Todo with id ${id} not found`);

    dbDeleteById(id);
}

export const todoRepository = {
    get,
    createWithContent,
    toggleDone,
    deleteById,
};
