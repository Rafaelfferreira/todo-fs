import { z as schema} from "zod";
import { Todo, TodoSchema } from "@ui/schema/todo";

// MARK: - Types
type TodoRepositoryGetParams = {
    page: number;
    limit: number;
};
type TodoRepositoryGetOutput = {
    todos: Todo[];
    total: number;
    pages: number;
};

// MARK: - Functions
function get({ page, limit }: TodoRepositoryGetParams): TodoRepositoryGetOutput {
    return fetch(`http://localhost:3000/api/todos?page=${page}&limit=${limit}`).then(
        async (serverResponse) => {
            const todosString = await serverResponse.text();
            const parsedResponse = parseTodosFromServer(JSON.parse(todosString));

            return {
                todos: parsedResponse.todos,
                total: parsedResponse.total,
                pages: parsedResponse.pages,
            };
        }
    );
}

function parseTodosFromServer(responseBody: unknown): { 
    todos: Todo[],
    total: number,
    pages: number
} {
    if(
        responseBody !== null && 
        typeof responseBody === "object" && 
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
            todos: responseBody.todos.map((todo: unknown) => {
                if(todo == null && typeof todo !== "object") {
                    throw new Error("Invalid todo from API");
                }
                
                const { id, content, date, done } = todo as { 
                    id: string,
                    content: string,
                    date: string,
                    done: string
                 };

                return {
                    id,
                    content,
                    done: String(done).toLowerCase() === "true",
                    date: date,
                }
            }),
        }
    }
    
    return {
        pages: 1,
        total: 0,
        todos: []
    }
};

export async function createWithContent(content: string): Promise<Todo> {
    const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
            // MIME type
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content,
        }),
    });

    if(response.ok) {
        const serverResponse = await response.json();
        const serverResponseSchema = schema.object({
            todo: TodoSchema,
        });
        const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);
        
        if (!serverResponseParsed.success) {
            throw new Error("Failed to create TODO");
        }

        const todo = serverResponseParsed.data.todo;
        return todo;
    }

    throw new Error("Failed to create TODO");
}

// MARK: - Exports
export const todoRepository = {
    get,
    createWithContent,
};
