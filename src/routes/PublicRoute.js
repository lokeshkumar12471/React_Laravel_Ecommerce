import React from "react";
import { getAuthData } from "../authData";
import { Navigate } from "react-router-dom";

export default function PublicRoutes({ children }) {
    const { isAuthenticated } = getAuthData();

    if (isAuthenticated) {
        return <>
            <Navigate to="/admin/dashboard" replace />
            <Navigate to="/" replace />
            {children}
        </>
    }
    return (
        <Navigate to="/" replace />
    );
}