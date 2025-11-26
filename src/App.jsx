import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/theme-context";
import Layout from "./routes/layout";
import DashboardPage from "./routes/dashboard/page";
import { useEffect } from "react";
import { KeycloakProvider } from "./contexts/KeycloakProvider";
import Login from "./routes/login";
import Logout from "./routes/logout";
import WelcomePage from "./routes/dashboard/welcome_page";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <WelcomePage />,
                },
                {
                    path: "chat",
                    children: [
                        { path: "new", element: <WelcomePage /> },
                        { path: ":id", element: <DashboardPage /> },
                    ],
                },
                // Auth
                { path: "login", element: <Login /> },
                { path: "logout", element: <Logout /> },
            ],
        },
    ]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const error = queryParams.get("error");
        if (error === "no-access") {
            alert("You do not have permission to log in to this system.");
            window.location.href = "/login";
        }
    }, []);

    return (
        <KeycloakProvider>
            <ThemeProvider storageKey="theme">
                <RouterProvider router={router} />
            </ThemeProvider>
        </KeycloakProvider>
    );
}

export default App;
