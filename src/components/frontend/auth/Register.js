import React, { useState } from 'react';
import Navbar from '../../../layouts/frontend/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const Register = () => {
    const navigate = useNavigate();
    const [registerInput, setRegisterInput] = useState({
        name: '',
        email: '',
        password: '',
        error_list: [],
    });
    const handleChange = (e) => {
        setRegisterInput({ ...registerInput, [e.target.name]: e.target.value })
    };

    const submitHandle = async (e) => {
        e.preventDefault();

        try {
            const csrf = await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
            const response = await axios.post('http://127.0.0.1:8000/api/register', registerInput, csrf);
            if (response.data.status === 200) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('auth_username', response.data.username);
                swal("Success", response.data.message, 'success');
                navigate('/');
            } else {
                setRegisterInput({ ...registerInput, error_list: response.data.validation_errors });
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    return (
        <div>
            <Navbar />
            <div>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4>Register</h4>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={submitHandle}>
                                        <div className="form-group mb-3">
                                            <label>Full Name</label>
                                            <input type="text" name="name" onChange={handleChange} className="form-control" />
                                            <span className='text-danger'>{registerInput.error_list.name}</span>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Email ID</label>
                                            <input type="text" name="email" onChange={handleChange} className="form-control" />
                                            <span className='text-danger'>{registerInput.error_list.email}</span>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Password</label>
                                            <input type="password" name="password" onChange={handleChange} className="form-control" />
                                            <span className='text-danger'>{registerInput.error_list.password}</span>
                                        </div>
                                        <div className="form-group mb-3">
                                            <button type="submit" className="btn btn-primary">Register</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Register;
