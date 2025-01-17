import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todos";

// const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg"; // importing using a URL
const bg = "/bg.jpeg"; // importing from the public folder

type HomeTodo = {
    id: string;
    content: string;
    done: boolean;
};

function HomePage() {
    // Use ref is used to track values that don't need to trigger an UI update
    const initialLoadComplete = React.useRef(false);

    // the function defined on the right side to update the value can accept a function with the old value as the parameter
    const [totalPages, setTotalPages] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [todos, setTodos] = React.useState<HomeTodo[]>([]);
    const [newTodoContent, setNewTodoContent] = React.useState("");
    const homeTodos = todoController.searchTodos<HomeTodo>(search, todos);
    const hasNoTodos = homeTodos.length === 0 && !isLoading;
    const hasMorePages = totalPages > page;

    // UseEffect allow us to run code when the component is rendered and upload it whenever the second parameter is refreshed
    // If we pass [] to the second parameter, the code will only run once
    React.useEffect(() => {
        if (!initialLoadComplete.current) {
            todoController.get({ page }).then(({ todos, pages }) => {
                setTodos((oldTodos) => {
                    return [
                        ...oldTodos,
                        ...todos,
                    ]
                })
                setTotalPages(pages);
            })
            .finally(() => {
                setIsLoading(false);
                initialLoadComplete.current = true;
            });
        }
    }, [page]);

    return (
        <main>
            <GlobalStyles themeName="indigo" />
            <header
                style={{
                    backgroundImage: `url('${bg}')`,
                }}
            >
                <div className="typewriter">
                    <h1>O que fazer hoje?</h1>
                </div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    todoController.create({
                        content: newTodoContent,
                        onSuccess(newTodo: HomeTodo) {
                            setTodos((oldTodos) => {
                                return [newTodo, ...oldTodos];
                            })
                            setNewTodoContent("");
                        },
                        onError() {
                            alert("You need to provide a content for the new task");
                        }
                    });
                }}>
                    <input 
                        name="Add todo"
                        type="text" 
                        placeholder="Correr, Estudar..."
                        value = {newTodoContent}
                        onChange = { function newTodoHandler(event) {
                            setNewTodoContent(event.target.value);
                        }} />
                    <button type="submit" aria-label="Adicionar novo item">
                        +
                    </button>
                </form>
            </header>

            <section>
                <form>
                    <input
                        type="text"
                        placeholder="Filtrar lista atual, ex: Dentista"
                        onChange={function handleSearch(event) {
                            setSearch(event.target.value);
                        }}
                    />
                </form>

                <table border={1}>
                    <thead>
                        <tr>
                            <th align="left">
                                <input type="checkbox" disabled />
                            </th>
                            <th align="left">Id</th>
                            <th align="left">Conteúdo</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {homeTodos.map((currentTodo) => {
                            return (
                                <tr key={currentTodo.id}>
                                    <td>
                                        <input 
                                            type="checkbox"
                                            defaultChecked={currentTodo.done}
                                            onChange = { function handleToggle() {
                                                todoController.toggleDone({
                                                    id: currentTodo.id,
                                                    onError() {
                                                        alert("Falha ao atualizar a todo");
                                                    },
                                                    updateTodoOnScreen() {
                                                        setTodos((homeTodos) => {
                                                            return homeTodos.map((todo) => {
                                                                if (todo.id === currentTodo.id) {
                                                                    return {
                                                                        ...todo,
                                                                        done: !todo.done,
                                                                    }
                                                                };
                                                                return todo;
                                                            })
                                                        });
                                                    }
                                                });
                                            }}
                                        />
                                    </td>
                                    <td>{currentTodo.id.substring(0, 4)}</td>
                                    <td>
                                        {!currentTodo.done && currentTodo.content}
                                        {currentTodo.done && <s>{currentTodo.content}</s>}
                                        </td>
                                    <td align="right">
                                        <button 
                                            data-type="delete"
                                            onClick={function handleClick() {
                                                
                                                todoController
                                                    .deleteById(currentTodo.id)
                                                    .then(()=> {
                                                        setTodos((homeTodos) => {
                                                            return homeTodos.filter((todo) => {
                                                                return todo.id !== currentTodo.id;
                                                            });
                                                        });
                                                    })
                                                    .catch(() => {
                                                        console.log("And error occurred while deleting the todo");
                                                    })
                                            }}>
                                            Apagar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {isLoading && (<tr>
                            <td
                                colSpan={4}
                                align="center"
                                style={{ textAlign: "center" }}
                            >
                                Carregando...
                            </td>
                        </tr>)}

                        {hasNoTodos && (<tr>
                            <td colSpan={4} align="center">
                                Nenhum item encontrado
                            </td>
                        </tr>)}

                        {hasMorePages && (<tr>
                            <td
                                colSpan={4}
                                align="center"
                                style={{ textAlign: "center" }}
                            >
                                <button
                                    data-type="load-more"
                                    onClick={() => {
                                        setIsLoading(true);
                                        const nextPage = page + 1;
                                        setPage(nextPage);

                                        todoController
                                            .get({ page: nextPage })
                                            .then(({ todos }) => {
                                                setTodos((oldTodos) => {
                                                    return [...oldTodos, ...todos];
                                                })
                                            })
                                            .finally(() => {
                                                setIsLoading(false);
                                            })
                                    }}
                                >
                                    Pagina {page}, Carregar mais{" "}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            marginLeft: "4px",
                                            fontSize: "1.2em",
                                        }}
                                    >
                                        ↓
                                    </span>
                                </button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

export default HomePage;
