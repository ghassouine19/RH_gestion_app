import NoLayout from "../layout/NoLayout";
import LoginPage from "../pages/LoginPage";
import Unauthorized from "../componants/userComponant/Unauthorized";


export const LoginRoute = [
    {
        element : <NoLayout />,
        children:[
            {
                path : "/login",
                element : <LoginPage />
            },
            {
                path : "/unauthorized",
                element : <Unauthorized />
            }
        ]
    }
];