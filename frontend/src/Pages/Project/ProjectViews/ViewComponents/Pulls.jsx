import React, { useState, useEffect } from 'react';

const Pulls = ({ repo, setCount }) => {
    const [ pulls, setPulls ] = useState([]);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        const fetchPulls = async () => {
            const request = await fetch(repo.pulls_url.replace(/\{\/number\}/gm, '') + "?per_page=500", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': navigator.userAgent
                }
            });

            const response = await request.json();

            if (request.status !== 200)
                setError(true);
            else {
                setPulls(response);
                setCount(prevState => 
                    prevState.map((c, i) => 
                        i === 1 ? response.length : c));
            }

        }

        fetchPulls();
    }, []);

    return (
        <React.Fragment>
            {error && <h1>There was an error fetching the pull requests</h1>}
            {(!error && pulls) && pulls.map(pr => 
                <div className="pr">
                    <h4>{pr.user.login} <span>{pr.title}</span></h4>
                    <a href={pr.html_url} target="_blank">View Pull Request</a>
                    <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                    <p>{pr.body}</p>
                </div>)}
            {(!error && pulls) && pulls.length < 1 && <h1>There aren't any pull requests!</h1>}
        </React.Fragment>
    );
}

export default Pulls;