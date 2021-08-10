import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Nav';
import isLoggedIn from '../../IsLoggedIn';
import { FRONTEND_PATH, BACKEND_PATH, join } from '../../PATH';
import Popup from '../../Components/Popup';

const Create = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();
    const [ github, setGithub ] = useState({ username: "", repo: "" });
    const [ submitErrors, setSubmitErrors ] = useState([]);
    const [ success, setSuccess ] = useState(false);
    const [ error, setError ] = useState(null);

    const createProjectHandler = async (e) => {
        e.preventDefault();

        const [ title, desc, shortDesc, , , allFeedback, allReviews, allThreads ] = e.target.parentElement.querySelectorAll("input");

        if (github.username !== "" || github.repo !== "") {
            const githubRequest = await fetch(`https://api.github.com/repos/${github.username}/${github.repo}`);

            if (githubRequest.status === 404) {
                setSubmitErrors((prevState) => [...prevState, "Invalid Github Repository"]);
            } 
        }
        
        if (submitErrors.length === 0) {
            const request = await fetch(join(BACKEND_PATH, "/project/createProject"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.value,
                    desc: desc.value,
                    shortDesc: shortDesc.value,
                    username: account.user_name,
                    pfp: account.pfp,
                    github,
                    allFeedback: allFeedback.value,
                    allReviews: allReviews.value,
                    allThreads: allThreads.value
                })
            });
            const response = await request.json();

            if (response.status === 201)
                setSuccess(true);
            else
                setError(response.message);
        }
    }

    useEffect(() => {
        isLoggedIn(window.localStorage)
            .then(res => {
                if (res.loggedIn) {
                    setLoggedIn(true);
                    setAccount(res.account);
                } else {
                    document.location.href = join(FRONTEND_PATH, "/register");
                }
            });
    }, []);

    return (
        <React.Fragment>
            {success && <Popup type="success" message="Successfully created project" />}
            {error && <Popup type="error" message={error} />}
            <Nav isLoggedIn={loggedIn} account={loggedIn ? account : null} />
            <form className="new-project" onSubmit={createProjectHandler}>

                <h1>New Project</h1>
                {submitErrors.map(error => 
                    <div className="submit-error">
                        <h4>{error}</h4>
                    </div>)}
                <h4>About The Project</h4>
                <div className="field-container">
                    <div className="input">
                        <label>Project Title</label>
                        <input required type="text" placeholder="e.g. My Chess App" maxLength="25" />
                    </div>
                    <div className="input">
                        <label>Project Description</label>
                        <input type="text" placeholder="e.g. This project is for users to..." maxLength="120" required />
                    </div>
                    <div className="input">
                        <label>Project Short Description</label>
                        <input type="text" placeholder="e.g. Play chess online." maxLength="50" required />
                    </div>
                </div>
                <h4>Version Control</h4>
                <div className="field-container">
                    <div className="input">
                        <label>Github Username</label>
                        <input type="text" placeholder="e.g. SoftwareFuze" onChange={
                            e => 
                                setGithub(prevState => {
                                    return { ...prevState, username: e.target.value }
                                })
                        } />
                    </div>
                    <div className="input">
                        <label>Github Repository</label>
                        <input type="text" placeholder="e.g. ShareFrame" onChange={
                            e =>
                                setGithub(prevState => {
                                    return { ...prevState, repo: e.target.value } 
                                })
                            } />
                    </div>
                    <div className="input">
                        <h4>Repo: https://github.com/{github.username !== "" ? github.username : "SoftwareFuze"}/{github.repo !== "" ? github.repo : "ShareFrame"}</h4>
                    </div>
                </div>
                <h4>Project Permissions</h4>
                <div className="field-container">
                    <div className="input">
                        <label>Allow Feedback</label>
                        <input type="checkbox" />
                    </div>
                    <div className="input">
                        <label>Allow Reviews</label>
                        <input type="checkbox" />
                    </div>
                    <div className="input">
                        <label>Allow Threads</label>
                        <input type="checkbox" />
                    </div>
                </div>
                <button type="submit">Create Project</button>
            </form>
        </React.Fragment>
    );
}

export default Create;