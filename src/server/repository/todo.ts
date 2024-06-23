import { read, create, update, deleteById as dbDeleteById } from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";

// MARK: - Supabase config 
// TODO: - Separate it in another file
// ############################################
import { createClient } from '@supabase/supabase-js';
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
    const { data, error, count } = await supabase.from('todos').select("*", {
        count: 'exact'
    });

    if (error) throw new Error("Failed to fetch data");

    const todos = data as Todo[];
    const total = count || todos.length;

    return {
        total: total,
        todos: todos,
        pages: 1 // 1 because we're bringing all the todos
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

//Model/Schema
type Todo = {
    id: string;
    content: string;
    date: string;
    done: boolean;
}
