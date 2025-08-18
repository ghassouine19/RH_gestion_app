import NoLayout from "../layout/NoLayout";
import LoginPage from "../pages/LoginPage";


export const LoginRoute = [
    {
        element : <NoLayout />,
        children:[
            {
                path : "/login",
                element : <LoginPage />
            }
        ]
    }
];