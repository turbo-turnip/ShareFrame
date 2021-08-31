import React, { useState, useEffect } from 'react';

const Commits = ({ repo, setCount }) => {
    const [ commits, setCommits ] = useState([]);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        const fetchCommits = async () => {
            const request = await fetch(repo.commits_url.replace(/\{\/sha\}/gm, '') + "?per_page=500", {
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
                setCommits(response); 
                setCount(prevState => 
                    prevState.map((c, i) => 
                        i === 0 ? response.length : c));
            }
        }

        fetchCommits();
    }, []);

    return (
        <React.Fragment>
            {error && <h1>There was an error fetching the commits</h1>}
            {(!error && commits) && commits.map(commit => 
                <div className="commit">
                    <h4>{commit.author.login} <span>{commit.commit.message}</span></h4>
                    <a href={commit.html_url} target="_blank">View Commit</a>
                    <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                </div>)}
            {(!error && commits) && commits.length < 1 && <h1>There aren't any commits!</h1>}
        </React.Fragment>
    );
}

export default Commits;