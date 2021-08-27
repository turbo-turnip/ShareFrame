import React, { useState, useEffect } from 'react';

const Branches = ({ repo }) => {
    const [ branches, setBranches ] = useState([]);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            const request = await fetch(repo.branches_url.replace(/\{\/branch\}/gm, '') + "?per_page=500", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': navigator.userAgent
                }
            });

            const response = await request.json();

            if (request.status !== 200)
                setError(true);
            else 
                setBranches(response);

        }

        fetchBranches();
    }, []);

    return (
        <React.Fragment>
            {error && <h1>There was an error fetching the branches</h1>}
            {(!error && branches) && branches.map(branch => 
                <div className="branch">
                    <h4><span>{branch.name}</span></h4>
                    <a href={`https://github.com/${repo.full_name}/tree/${branch.name}`} target="_blank">View Branch</a>
                </div>)}
            {(!error && branches) && branches.length < 1 && <h1>There aren't any branches!</h1>}
        </React.Fragment>
    );
}

export default Branches;