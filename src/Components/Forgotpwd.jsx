import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import './Forgotpwd.css'; // Import custom styles

function Forgotpwd() {
    let [email, setEmail] = useState("");

    let submitHandler = async (e) => {
        e.preventDefault();
        let userEmail = { email: email };

        let response = await fetch(`${API_BASE_URL}/forgotpwd`, {
            method: 'POST',
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(userEmail),
        });

        let result = await response.json();
        if (result !== 200) {
            alert(result.message);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4 rounded">
                        <h2 className="text-center mb-4">Enter Email ID</h2>
                        <hr />
                        <form onSubmit={submitHandler}>
                            <div className="mb-3 position-relative">
                                <input
                                    type="text"
                                    className="form-control form-control-lg rounded-3"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email ID"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 btn-lg rounded-3">
                                SEND<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span>
                            </button>

                        </form>
                        <p className="text-muted text-center mt-3 small">
                            You will receive a link in your email. If you don't see it, please check your <strong>Spam</strong> folder.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forgotpwd;
