import DashBoardLayout from "../layout/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import ResponsablePage from "../pages/ResponsablePage";
import AdminPage from "../pages/AdminPage";
import UserProfile from "../componants/userComponant/UserProfile";
import Calendar from "../componants/userComponant/Calendar";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboardPage from "../pages/AdminDashboardPage";

export const UserRoute = [
    {
        element : <DashBoardLayout />,
        children :[
            {
                path : "/user",
                element : (
                    <ProtectedRoute
                        element={<DashboardPage />}
                        allowedRoles={["EMPLOYE", "ADMIN", "RESPONSABLE"]}
                    />
                ),
            },
            {
                path : "/respo",
                element: (
                    <ProtectedRoute
                        element={<ResponsablePage />}
                        allowedRoles={["ADMIN", "RESPONSABLE"]}
                    />
                ),
            },
            {
                path : "/admin",
                element: (
                    <ProtectedRoute
                        element={<AdminPage />}
                        allowedRoles={["ADMIN"]}
                    />
                ),
            },
            {
                path : "/user/profile",
                element: (
                    <ProtectedRoute
                        element={<UserProfile />}
                        allowedRoles={["EMPLOYE", "ADMIN", "RESPONSABLE"]}
                    />
                ),
            },{
                path : "/user/calendar",
                element : (
                    <ProtectedRoute
                        element={<Calendar />}
                        allowedRoles={["ADMIN"]}
                    />
                ),
            },
            {
                path : "/admin/dashboard",
                element: (
                    <ProtectedRoute
                        element={<AdminDashboardPage />}
                        allowedRoles={["ADMIN"]}
                    />
                ),
            }
        ]
    }
];