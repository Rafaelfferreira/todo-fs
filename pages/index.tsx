import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todos";

// const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg"; // importing using a URL
const bg = "/bg.jpeg"; // importing from the public folder

type HomeTodo = {
    id: string;
    content: string;
};

function HomePage() {
    // the function defined on the right side to update the value can accept a function with the old value as the parameter
    const [initialLoadedCompleted, setInitialLoadedCompleted] = React.useState(false);
    const [totalPages, setTotalPages] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [todos, setTodos] = React.useState<HomeTodo[]>([]);
    const hasNoTodos = todos.length === 0 && !isLoading;

    const hasMorePages = totalPages > page;

    // UseEffect allow us to run code when the component is rendered and upload it whenever the second parameter is refreshed
    // If we pass [] to the second parameter, the code will only run once
    React.useEffect(() => {
        setInitialLoadedCompleted(true);
        if (!initialLoadedCompleted) {
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
                <form>
                    <input type="text" placeholder="Correr, Estudar..." />
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
                        {todos.map((currentTodo) => {
                            return (
                                <tr key={currentTodo.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{currentTodo.id.substring(0, 4)}</td>
                                    <td>{currentTodo.content}</td>
                                    <td align="right">
                                        <button data-type="delete">
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
                                            .then(({ todos, pages }) => {
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
