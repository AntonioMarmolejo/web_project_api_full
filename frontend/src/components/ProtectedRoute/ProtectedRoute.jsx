import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../../utils/token";

export default function ProtectedRoute({ children }) {
    const token = getToken();

    if (!token) {
        // Si no hay token, redirige a /signin
        return <Navigate to="/signin" replace />;
    }

    // Si hay token, permite renderizar el componente hijo
    return children;
}
