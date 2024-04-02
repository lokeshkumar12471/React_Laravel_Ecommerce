import React from 'react';
import Navbar from '../../../layouts/frontend/Navbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import AuthUser from '../../../routes/AuthUser';

const Login = () => {
    const navigate = useNavigate();
    const { http, setToken } = AuthUser();
    const [LoginInput, setLoginInput] = useState({
        email: "",
        password: "",
        error_list: [],
    });
    const handleChange = (e) => {
        setLoginInput({ ...LoginInput, [e.target.name]: e.target.value })
    }

    const submitHandle = async (e) => {
        e.preventDefault();
        try {
            const response = await http.post(`http://localhost:8000/api/login`, LoginInput);
            if (response.data.status === 200) {
                setToken(response.data.access_token, response.data.user, response.data.role);
                swal("Success", response.data.message, 'success');
                if (response.data.user.role_as === "admin") {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else if (response.data.status === 401) {
                swal("Warning", response.data.message, "warning");
            } else {
                setLoginInput({ ...LoginInput, error_list: response.data.validation_errors })
            }

        } catch (error) {
            console.error('Login is not successfully');
        }



    }
    return (
        <div>
            <Navbar />
            <div>
                <div>
                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Login</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={submitHandle}>
                                            <div className="form-group mb-3">
                                                <label>Email ID</label>
                                                <input type="text" name="email" onChange={handleChange} className="form-control" />
                                                <span className='text-danger'>{LoginInput.error_list && LoginInput.error_list.email}</span>
                                            </div>
                                            <div className="form-group mb-3">
                                                <label>Password</label>
                                                <input type="password" name="password" onChange={handleChange} className="form-control" />
                                                <span className='text-danger'>{LoginInput.error_list && LoginInput.error_list.password}</span>
                                            </div>
                                            <div className="form-group mb-3">
                                                <button type="submit" className="btn btn-primary">Login</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;
