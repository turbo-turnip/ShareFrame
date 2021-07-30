import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ isLoggedIn, account }) => {
    useEffect(() => {
        const navbar = document.querySelector("#root > .navbar");

        window.addEventListener("scroll", () => {
            if (window.scrollY > 700) {
                navbar.style.height = "8vh";
                navbar.style.boxShadow = "0 5px 20px #0003";
            } else {
                navbar.style.height = "10vh";
                navbar.style.boxShadow = null;
            }
        });
    }, []);

    return (
        <nav className="navbar">
            <div className="logo">
                <img src="/media/logo.svg" alt="ShareFrame" />
                <h4>ShareFrame</h4>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/discover">Discover</Link>
                <Link to="/create">Create</Link>
                {
                    !isLoggedIn ?
                        <React.Fragment>
                            <button>
                                <Link to="/register">Register</Link>
                            </button>
                            <button>
                                <Link to="/login">Login</Link>
                            </button>
                        </React.Fragment>
                    :
                        <React.Fragment>
                            <img src={account.pfp} alt={account.username} />
                            <button className="account-btn">
                                <Link to="/account">Account</Link>
                            </button>
                        </React.Fragment>
                }
            </div>
        </nav>
    );
}

export default Nav;