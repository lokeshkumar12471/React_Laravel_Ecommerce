import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PrivateRoutes({ children }) {
    const navigate = useNavigate();
    const [Authenticated, setAuthenticated] = useState(false);
    const [loading, setloading] = useState(true);

    useEffect(() => {

        axios.get(`http://127.0.0.1:8000/api/checkingAuthenticated`).then(res => {
            if (res.status === 200) {
                setAuthenticated(true);
            }
            setloading(false);
        });

        return () => {
            setAuthenticated(false);
        };
    }, []);

    axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
        if (err.response.status === 401) {
            swal("Unauthorized", err.response.data.message, "warning");
            navigate('/');
        }
        return Promise.reject(err);
    });

    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (error.response.status === 403) // Access Denied
        {
            swal("Forbidden", error.response.data.message, "warning");
            navigate('/403');
        }
        else if (error.response.status === 404) //Page Not Found
        {
            swal("404 Error", "Url/Page Not Found", "warning");
            navigate('/404');
        } else if (error.response.status === 404) {

        }
        return Promise.reject(error);
    }
    );

    if (loading) {
        return <h1>Loading...</h1>
    }


    if (!Authenticated) {
        swal('Warning', 'Unauthorized', 'warning');
        return <Navigate to="/" replace />;
    }
    return children;
}
