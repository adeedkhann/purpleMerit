import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;