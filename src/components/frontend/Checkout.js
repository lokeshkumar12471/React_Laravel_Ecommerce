import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {

    const navigate = useNavigate();

    if (!localStorage.getItem('auth_token')) {
        navigate('/');
        swal("Warning", "Login to goto Cart Page", "error");
    }

    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState([]);

    var totalCartPrice = 0;

    const [checkoutInput, setCheckoutInput] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
    });
    const handleInput = (e) => {
        setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
    }
    useEffect(() => {

        axios.get(`http://localhost:8000/api/cart`).then(res => {
            if (res.data.status === 200) {
                setCart(res.data.cart);
                setLoading(false);
            }
            else if (res.data.status === 401) {
                navigate('/');
                swal("Warning", res.data.message, "error");
            }

        });
    }, [navigate]);

    var orderinfo_data = {
        firstname: checkoutInput.firstname,
        lastname: checkoutInput.lastname,
        phone: checkoutInput.phone,
        email: checkoutInput.email,
        address: checkoutInput.address,
        city: checkoutInput.city,
        state: checkoutInput.state,
        zipcode: checkoutInput.zipcode,
        payment_mode: 'Paid by PayPal',
        payment_id: '',
    }

    // Paypal Code
    const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: totalCartPrice,
                    },
                },
            ],
        });
    };
    const onApprove = (data, actions) => {
        // return actions.order.capture();
        return actions.order.capture().then(function (details) {
            console.log(details);
            orderinfo_data.payment_id = details.id;

            axios.post(`/api/place-order`, orderinfo_data).then(res => {
                if (res.data.status === 200) {
                    swal("Order Placed Successfully", res.data.message, "success");
                    setError([]);
                    navigate('/thank-you');
                }
                else if (res.data.status === 422) {
                    swal("All fields are mandetory", "", "error");
                    setError(res.data.errors);
                }
            });
        });
    };
    // End-Paypal Code



    const submitOrder = async (e, payment_mode) => {
        e.preventDefault();
        var data = {
            firstname: checkoutInput.firstname,
            lastname: checkoutInput.lastname,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            address: checkoutInput.address,
            city: checkoutInput.city,
            state: checkoutInput.state,
            zipcode: checkoutInput.zipcode,
            payment_mode: payment_mode,
            payment_id: '',
        }


        switch (payment_mode) {
            case 'cod':
                const cod = await axios.post(`http://localhost:8000/api/place-order`, data);
                if (cod.data.status === 200) {
                    swal("Order Placed Successfully", cod.data.message, "success");
                    setError([]);
                    navigate('/thank-you');

                } else if (cod.data.status === 422) {
                    swal("All fields are mandetory", "", "error");
                    setError(cod.data.errors);
                }
                break;
            case 'razorpay':
                const razorpay = await axios.post(`http://localhost:8000/api/validate-order`, data);
                if (razorpay.data.status === 200) {
                    setError([]);

                    var options = {
                        "key": "rzp_test_5AEIUNtEJxBPvS",
                        "amount": (totalCartPrice * 100), // 100 is paise multiple by totalcartprice.
                        "name": "Lokesh Web Solutions",
                        "description": "Thank you for Purchasing With Us!",
                        "image": "https://example.com/your_logo",
                        "handler": function (response) {
                            alert(response.razorpay_payment_id);
                            data.payment_id = response.razorpay_payment_id;
                            const cod = axios.post(`http://localhost:8000/api/place-order`, data);
                            if (cod.data.status === 200) {
                                swal("Order Placed Successfully", cod.data.message, "success");
                                setError([]);
                                navigate('/thank-you');

                            }
                        },

                        "prefill": {
                            "name": data.firstname + data.lastname,
                            "email": data.email,
                            "contact": data.phone
                        },
                        "theme": {
                            "color": "#F37254"
                        }
                    };
                    var rzp = new window.Razorpay(options);
                    rzp.open();

                } else if (razorpay.data.status === 422) {
                    swal("All fields are mandetory", "", "error");
                    setError(razorpay.data.errors);
                }
                break;

            case 'payonline':
                const payonline = await axios.post(`/api/validate-order`, data)
                if (payonline.data.status === 200) {
                    setError([]);
                    var myModal = new window.bootstrap.Modal(document.getElementById('payOnlineModal'));
                    myModal.show();
                }
                else if (payonline.data.status === 422) {
                    swal("All fields are mandetory", "", "error");
                    setError(payonline.data.errors);
                }
                break;

            default:
                break;
        }



    }

    if (loading) {
        return <h4>Loading Checkout...</h4>
    }

    var checkout_HTML = '';
    if (cart.length > 0) {
        checkout_HTML = <div>
            <div className="row">

                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header">
                            <h4>Basic Information</h4>
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label> First Name</label>
                                        <input type="text" name="firstname" onChange={handleInput} value={checkoutInput.firstname} className="form-control" />
                                        <small className="text-danger">{error.firstname}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label> Last Name</label>
                                        <input type="text" name="lastname" onChange={handleInput} value={checkoutInput.lastname} className="form-control" />
                                        <small className="text-danger">{error.lastname}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label> Phone Number</label>
                                        <input type="number" name="phone" onChange={handleInput} value={checkoutInput.phone} className="form-control" />
                                        <small className="text-danger">{error.phone}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label> Email Address</label>
                                        <input type="email" name="email" onChange={handleInput} value={checkoutInput.email} className="form-control" />
                                        <small className="text-danger">{error.email}</small>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <label> Full Address</label>
                                        <textarea rows="3" name="address" onChange={handleInput} value={checkoutInput.address} className="form-control"></textarea>
                                        <small className="text-danger">{error.address}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>City</label>
                                        <input type="text" name="city" onChange={handleInput} value={checkoutInput.city} className="form-control" />
                                        <small className="text-danger">{error.city}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>State</label>
                                        <input type="text" name="state" onChange={handleInput} value={checkoutInput.state} className="form-control" />
                                        <small className="text-danger">{error.state}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>Zip Code</label>
                                        <input type="text" name="zipcode" onChange={handleInput} value={checkoutInput.zipcode} className="form-control" />
                                        <small className="text-danger">{error.zipcode}</small>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group text-end">
                                        <button type="button" className="btn btn-primary mx-1" onClick={(e) => submitOrder(e, 'cod')}>Place Order</button>
                                        <button type="button" className="btn btn-primary mx-1" onClick={(e) => submitOrder(e, 'razorpay')}>Pay by Razorpay</button>
                                        <button type="button" className="btn btn-warning mx-1" onClick={(e) => submitOrder(e, 'payonline')}>Pay Online</button>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th width="50%">Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, idx) => {
                                totalCartPrice += item.product.selling_price * item.product_qty;
                                return (
                                    <tr key={idx}>
                                        <td>{item.product.name}</td>
                                        <td>{item.product.selling_price}</td>
                                        <td>{item.product_qty}</td>
                                        <td>{item.product.selling_price * item.product_qty}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colSpan="2" className="text-end fw-bold">Grand Total</td>
                                <td colSpan="2" className="text-end fw-bold">{totalCartPrice}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    }
    else {
        checkout_HTML = <div>
            <div className="card card-body py-5 text-center shadow-sm">
                <h4>Your Shopping Cart is Empty. You are in Checkout Page.</h4>
            </div>
        </div>
    }

    return (
        <div>

            <div className="modal fade" id="payOnlineModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Online Payment Mode</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <hr />
                            <PayPalButton
                                createOrder={(data, actions) => createOrder(data, actions)}
                                onApprove={(data, actions) => onApprove(data, actions)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Checkout</h6>
                </div>
            </div>

            <div className="py-4">
                <div className="container">
                    {checkout_HTML}
                </div>
            </div>

        </div>
    )
}
export default Checkout;