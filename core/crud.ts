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
export function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}
