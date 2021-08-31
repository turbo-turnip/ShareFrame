import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import isLoggedIn from '../../IsLoggedIn';
import { FRONTEND_PATH, join } from '../../PATH';
import Username from './Username';
import Profile from './Profile';
import Password from './Password';

const Account = () => {
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
            {account && 
                <div className="account-page">
                    <Username account={account} />
                    <Profile account={account} />
                    <Password account={account} />
                </div>}
        </React.Fragment>
    );
}

export default Account;