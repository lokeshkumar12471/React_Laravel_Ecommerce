import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();
    const logoutSumbit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://your-api-url/logout');
            if (response.data.status === 200) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                swal('Success', response.data.message, 'success').then(() => {
                    navigate('/login');
                });
            }
        } catch (error) {
            console.error('Logout Error', error.response);
            swal('Error', 'Failed to logout. Please try again.', 'error');
        }
    }
    var AuthButtons = '';
    if (!sessionStorage.getItem('token')) {
        AuthButtons = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                </li>
            </ul>
        );
    }
    else {
        AuthButtons = (
            <li className="nav-item">
                <button type="button" onClick={logoutSumbit} className="nav-link btn btn-danger btn-sm text-white">Logout</button>
            </li>
        );
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="#">Navbar</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/collections">Collection</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">Cart</Link>
                        </li>

                        {AuthButtons}
                    </ul>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
