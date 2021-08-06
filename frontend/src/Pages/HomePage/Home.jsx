import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import Banner from './Banner';
import Panel from './Panel';
import isLoggedIn from '../../IsLoggedIn';

const Home = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();

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
            <Nav isLoggedIn={loggedIn} account={loggedIn ? account : null} />
            <Banner />
            <main className="panels">
                <Panel 
                    title="Promote your project!"
                    description="Share your development process and project on ShareFrame! Announce updates, share your project's status, add contributors, host polls, and a lot more!"
                    image="/media/panel1.svg"
                    alt="Promote your project!" />
                <Panel
                    title="Support other developers' software!"
                    description="On ShareFrame, you can also support other developers' projects! Ask questions about the project, find and report bugs, view updates, participate in events and polls, and way more!"
                    image="/media/panel2.svg"
                    alt="Support other developers' software!" />
                <Panel 
                    title="Contribute to projects!"
                    description="Ask the owner of a project to add you as a contributor, and then you can contribute to announcements, host voice calls with all the contributors, add polls and events, and more!"
                    image="/media/panel3.svg"
                    alt="Contribute to projects!" />
            </main>
        </React.Fragment>
    );
}

export default Home;