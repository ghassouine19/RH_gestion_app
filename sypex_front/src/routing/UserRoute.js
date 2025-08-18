import DashBoardLayout from "../layout/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import ResponsablePage from "../pages/ResponsablePage";
import AdminPage from "../pages/AdminPage";


export const UserRoute = [
    {
        element : <DashBoardLayout />,
        children :[
            {
                path : "/user",
                element : <DashboardPage />
            },
            {
                path : "/respo",
                element: <ResponsablePage />
            },
            {
                path : "/admin",
                element: <AdminPage />
            }
        ]
    }
];