import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import isLoggedIn from '../../IsLoggedIn';
import { BACKEND_PATH, join } from '../../PATH';
import UserProject from './UserProject';

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

const User = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();
    const [ error, setError ] = useState(false);
    const [ user, setUser ] = useState();
    const [ following, setFollowing ] = useState(false);
    const [ projects, setProjects ] = useState([]);
    const [ followers, setFollowers ] = useState(0);

    const fetchProjects = async (username) => {
        const request = await fetch(join(BACKEND_PATH, "/user/getProjects"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        const response = await request.json();

        if (request.status !== 200) {
            setError(response.message);
        } else setProjects(response.contributing);
    }

    const updateFollowHandler = async () => {
        if (following) {
            const request = await fetch(join(BACKEND_PATH, "/user/unfollow"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name,
                    pfp: account.pfp,
                    followUser: user.user_name
                })
            });

            const response = await request.json();

            if (request.status === 200) {
                setFollowing(false);
                setFollowers(response.followers.length);
            }
        } else {
            const request = await fetch(join(BACKEND_PATH, "/user/follow"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name,
                    pfp: account.pfp,
                    followUser: user.user_name
                })
            });

            const response = await request.json();

            if (request.status === 200) {
                setFollowing(true);
                setFollowers(response.followers.length);
            }
        }
    }

    useEffect(() => {
        isLoggedIn(window.localStorage)
            .then(res => {
                if (res.loggedIn) {
                    setLoggedIn(true);
                    setAccount(res.account);
                }
            });
    }, []);

    useEffect(() => {
        if (searchParams.has("name")) {
            const fetchUser = async () => {
                const request = await fetch(join(BACKEND_PATH, "/user/getUser"), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: searchParams.get("name")
                    })
                });

                const response = await request.json();

                if (request.status !== 200) {
                    setError(response.message);
                } else setUser(response.user);
            }

            fetchUser();
        } else setError("Cannot find user without a name");
    }, []);

    useEffect(() => {
        if (user) {
            fetchProjects(user.user_name);

            if (user.followers && loggedIn)
                user.followers.forEach(follower => follower.user === account.user_name ? setFollowing(true) : null);

            if (user.followers)
                setFollowers(user.followers.length);
        }
    }, [ user ]);

    return (
        <React.Fragment>
            <Nav isLoggedIn={loggedIn} account={loggedIn ? account : null} />
            {error && <h1 className="url-error">{error}</h1>}
            {user &&
                <div className="user-account">
                    <div className="user-banner">
                        <img src="/media/banner.svg" className="background" />
                        <div>
                            <h4>{user.user_name}</h4>
                            <img src={user.pfp} className="pfp" />
                        </div>
                        <div className="content">
                            <h4>{followers} follower{(following !== null && user.followers.length) !== 1 && "s"}</h4>
                            {loggedIn && <button onClick={updateFollowHandler}>{following ? "Unf" : "F"}ollow</button>}
                        </div>

                    </div>
                    <h1>Projects</h1>
                    <div className="user-projects">
                        {projects.map(project => <UserProject project={project} />)}
                    </div>
                </div>}
        </React.Fragment>
    );
}

export default User;