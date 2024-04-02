import React from 'react';
import Navbar from '../../layouts/frontend/Navbar';

function Thankyou() {
    return (
        <div>
            <Navbar />
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Thank you</h6>
                </div>
            </div>

            <div className="py-4">
                <div className="container">
                    <div class="col-md-12">
                        <div className="card text-center p-5">
                            <h4>Thanks for purchasing with Funda of Web IT - ReactJS Hooks Ecommerce</h4>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Thankyou;