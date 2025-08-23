import DashBoardLayout from "../layout/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import ResponsablePage from "../pages/ResponsablePage";
import AdminPage from "../pages/AdminPage";
import UserProfile from "../componants/userComponant/UserProfile";
import Calendar from "../componants/userComponant/Calendar";


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
            },
            {
                path : "/user/profile",
                element: <UserProfile />
            },{
                path : "/user/calendar",
                element : <Calendar />
            }
        ]
    }
];