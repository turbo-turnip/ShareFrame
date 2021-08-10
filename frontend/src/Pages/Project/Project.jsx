import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import isLoggedIn from '../../IsLoggedIn';

const Project = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();
    const [ owner, setOwner ] = useState(false);

    useEffect(() => {
        isLoggedIn(window.localStorage)
            .then(res => {
                if (res.loggedIn) {
                    setLoggedIn(true);
                    setAccount(res.account);
                }
            });
    }, []);

    return (
        <React.Fragment>
            <Nav isLoggedIn={loggedIn} account={account} />
            <div className="project-page">
            </div>
        </React.Fragment>
    );
}

export default Project;