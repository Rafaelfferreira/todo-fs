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
    .order("date", { ascending: false } )
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
    // const newTodo = create(content);
    // return newTodo;
    const { data, error } = await supabase.from('todos').insert([
        {
            content,
        }
    ])
    .select()
    .single()

    if (error) throw new Error("Failed to create todo");
    const parsedData = TodoSchema.parse(data);
    return parsedData;
};

async function getTodoById(id: string): Promise<Todo> {
    const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error("Failed to find todo with id");

    const parsedData = TodoSchema.safeParse(data);
    if (!parsedData.success) throw new Error("Failed to parse TODO with given id");

    return parsedData.data;
}

async function toggleDone(id: string): Promise<Todo> {
    const todo = await getTodoById(id);

    const { data, error } = await supabase
        .from("todos")
        .update({
            done: !todo.done
        })
        .eq("id", id)
        .select();

    if (error) throw new Error("Failed to update TODO by id");
    const parsedData = TodoSchema.parse(data[0]);

    console.log("PARSED DATA: ", parsedData);

    return parsedData;
}

async function deleteById(id: string) {
    const { error } = await supabase.from("todos").delete().match({
        id,
    });

    if(error) throw new HttpNotFoundError(`Todo with id ${id} not found`);
}

export const todoRepository = {
    get,
    createWithContent,
    toggleDone,
    deleteById,
};
