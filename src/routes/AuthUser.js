import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const useAuthUser = () => {

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken;
    }


    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        const user_detail = JSON.parse(userString);
        return user_detail;
    }

    const getRole = () => {
        const user_role_as = sessionStorage.getItem('role');
        const user_role = JSON.parse(user_role_as);
        return user_role;

    }

    const navigate = useNavigate();
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());
    const [role, setRole] = useState(getRole());

    const saveToken = (token, user, role) => {
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('role', JSON.stringify(role));

        setToken(token);
        setUser(user);
        setRole(role);
        if (role === "admin") {
            navigate('admin/dashboard');
        } else {
            navigate('/');
        }
    }


    const http = axios.create({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }

    });
    return {
        setToken: saveToken,
        token, user, role, getToken, getRole,
        http,

    }


}

export default useAuthUser;