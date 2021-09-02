import React, { useEffect, useState } from 'react';
import isLoggedIn from '../../IsLoggedIn';
import Nav from '../../Components/Nav';
import { join, FRONTEND_PATH } from '../../PATH';
import Trending from './Trending';
import Projects from './Projects';

const Discover = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();

    useEffect(() => {
        isLoggedIn(window.localStorage)
            .then(res => {
                if (res.loggedIn) {
                    setLoggedIn(true);
                    setAccount(res.account);
                } else document.location.href = join(FRONTEND_PATH, "/register");
            });
    }, []);

    return (
        <React.Fragment>
            <Nav isLoggedIn={loggedIn} account={loggedIn ? account : null} />
            <div className="discover">
                <h1>Trending</h1>
                <div className="discover-trending">
                    <Trending />
                </div>
                <h1>Projects</h1>
                <Projects />
            </div>
        </React.Fragment>
    );
}

export default Discover;