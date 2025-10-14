import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role; // ton backend doit inclure "role" dans le payload

        if (allowedRoles && !allowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return element; // ✅ on retourne directement le composant
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
