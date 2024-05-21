import fs from "fs";
import { v4 as uuid } from "uuid";

// MARK: - CONSTANTS
const DB_FILE_PATH = "./core/db";

// MARK: - TYPES
type UUID = string;

type Todo = {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
};

// MARK: - CRUD FUNCTIONS
export function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };

    const todos: Array<Todo> = [
        ...read(),
        todo,
    ];

    // salvar o content no sistema
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
        "dogs": []
    }, null, 2)); // Sync -> synchronous
    return todo;
}

export function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

export function update(id: UUID, partialTodo: Partial<Todo>): Todo { // Partial<Todo> -> Partial is a built-in type that makes all properties of Todo optional
    let updatedTodo;

    const todos = read();
    todos.forEach((currentItem) => {
        const isToUpdate = currentItem.id === id;
        if(isToUpdate) {
            updatedTodo = Object.assign(currentItem, partialTodo); // Object.assign -> built-in function that copies all properties from the second object to the first object
        }
    });
    
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 2));

    if(!updatedTodo) {
        throw new Error("Please provide another ID!")
    }

    return updatedTodo;
}
