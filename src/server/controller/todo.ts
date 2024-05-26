import { HttpNotFoundError } from "@server/infra/errors";
import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

async function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query;
    const page = Number(query.page);
    const limit = Number(query.limit);

    // MARK: - Error handling
    if (query.page && isNaN(page)) {
        res.status(400).json({
            error: {
                message: "`page` must be a number"
            }
        });
    }

    if (query.limit && isNaN(limit)) {
        res.status(400).json({
            error: {
                message: "`limit` must be a number"
            }
        });
    }

    const output = todoRepository.get({
        page,
        limit,
    });

    res.status(200).json({
        total: output.total,
        pages: output.pages,
        todos: output.todos,
    });
}

const TodoCreateBodySchema = schema.object({
    content: schema.string(),
});
async function create(req: NextApiRequest, res: NextApiResponse) {
    // Fail fast validation
    const body = TodoCreateBodySchema.safeParse(req.body);

    // Type Narrowing
    if(!body.success) {
        res.status(400).json({
            error: {
                message: "You need to provide a content to create a TODO",
                description: body.error.issues,
            },
        });
        return;
    }

    const createdTodo = await todoRepository.createWithContent(body.data.content);

    res.status(201).json({
        todo: createdTodo,
    });
};

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
    const todoId = req.query.id;

    if(!todoId || typeof todoId !== "string") {
        return res.status(400).json({
            error: {
                message: "You must provide a string ID"
            }
        })
    }

    try {
        const updatedTodo = await todoRepository.toggleDone(todoId);

    res.status(200).json({
        todo: updatedTodo,
    })
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({
                error: {
                    message: "Todo not found",
                }
            });
        }
    }
    
};

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
    const QuerySchema = schema.object({
        id: schema.string().uuid().min(1),
    });

    // Fail fast
    const parsedQuery = QuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
        res.status(400).json({
            error: {
                message: "Invalid id",
            }
        });
        return;
    }

    try {
        const todoId = parsedQuery.data.id;
        await todoRepository.deleteById(todoId);
        res.status(204).end();
    } catch(error) {
        if (error instanceof HttpNotFoundError) {
            res.status(error.status).json({
                error: {
                    message: error.message,
                }
            });
        }
        
        res.status(500).json({
            error: {
                message: `Internal server error`,
            }
        })
    }

    
}

export const todoController = {
    get,
    create,
    toggleDone,
    deleteById,
};
