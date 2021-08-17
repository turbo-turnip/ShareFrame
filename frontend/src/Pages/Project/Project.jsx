import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import isLoggedIn from '../../IsLoggedIn';
import { BACKEND_PATH, join } from '../../PATH';
import ProjectBanner from './ProjectBanner';
import ProjectBar from './ProjectBar';

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

const Project = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();
    const [ owner, setOwner ] = useState(false);
    const [ project, setProject ] = useState();
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ viewsCount, setViewsCount ] = useState({});

    const fetchProject = async (user, name) => {
        const request = await fetch(join(BACKEND_PATH, "/project/getProject"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user, name
            })
        });
        const response = await request.json();

        setLoading(false);

        if (request.status === 200) {
            setProject(response.project);
        } else 
            setError(response.message);
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
        if (searchParams.has("name") && searchParams.has("user")) {
            fetchProject(searchParams.get("user"), searchParams.get("name"));
        } else 
            setError("Project must have owner and title");
    }, []);

    useEffect(() => {
        if (project) {
            if (localStorage.hasOwnProperty("at")) {
                const at = localStorage.getItem("at");
                fetch(join(BACKEND_PATH, "/auth/validateToken"), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: at
                    })
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.account) {
                            setOwner(res.account.user_pass === project.user_pass)
                        }
                    });
            }
        }
    }, [ project ]);

    return (
        <React.Fragment>
            <Nav isLoggedIn={loggedIn} account={account} />
            <div className="project-page">
                {error && <h1 className="url-error">{error}</h1>}
                {!error && 
                    <React.Fragment>
                        <ProjectBanner viewsCount={viewsCount} loading={loading} setViewsCount={setViewsCount} project={project} />
                    </React.Fragment>
                }
            </div>
            {!error && <ProjectBar project={project} owner={owner} />}
        </React.Fragment>
    );
}

export default Project;