import React from 'react';
import { Link } from 'react-router-dom';

const Form = ({ type, submitHandler }) => {
    return (
        <form className="auth-form" onSubmit={
            (e) => {
                e.preventDefault();
                submitHandler(e);
            }
        }>
            <div className="auth-content">
                <div className="auth-field">
                    <label>Username</label>
                    <input type="text" placeholder="e.g. example name" required />
                </div>
                {
                    type === "register" &&
                        <div className="auth-field">
                            <label>Email</label>
                            <input type="email" placeholder="e.g. user@example.com" required />
                        </div>
                }
                <div className="auth-field">
                    <label>Password</label>
                    <input type="password" placeholder="e.g. V3rY sTr0nG p4sSw0rD" required />
                </div>
                <Link to="/login">Have an account? Login</Link>
                <Link to="/">Back home</Link>
            </div>

            <button type="submit">{type[0].toUpperCase() + type.slice(1, type.length)}</button>
        </form>
    );
}

export default Form;