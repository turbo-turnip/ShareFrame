import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Nav';
import isLoggedIn from '../../IsLoggedIn';
import { BACKEND_PATH, join } from '../../PATH';

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

const Project = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();
    const [ owner, setOwner ] = useState(false);
    const [ project, setProject ] = useState();
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);

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

    return (
        <React.Fragment>
            <Nav isLoggedIn={loggedIn} account={account} />
            <div className="project-page">
                {error && <h1 className="url-error">{error}</h1>}
                {!error && 
                    <div className="project-banner">
                        <img src="/media/project-banner.svg" alt="Project" />
                        <h1>{loading ? "Loading..." : (project) && project.project_title}</h1>
                        <h4>{loading ? "Loading..." : (project) && project.project_desc_short}</h4>
                    </div>
                }
            </div>
        </React.Fragment>
    );
}

export default Project;