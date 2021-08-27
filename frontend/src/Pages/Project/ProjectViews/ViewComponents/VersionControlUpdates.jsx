import React, { useEffect, useState } from 'react';
import Commits from './Commits';
import Pulls from './Pulls';
import Branches from './Branches';

const VersionControlUpdates = ({ repo }) => {
    const [ currView, setCurrView ] = useState(0);
    const [ innerWidth, setInnerWidth ] = useState(window.innerWidth);

    useEffect(() => window.addEventListener('resize', e => setInnerWidth(window.innerWidth)), []);

    return (
        <div className="version-control-updates" style={{ width: `calc(${innerWidth - 320 - 20}px - 4em)` }}>
            {repo &&
                <React.Fragment>
                    {console.log(repo)}
                    <div className="view-selection">
                        <button onClick={() => setCurrView(0)}>Commits</button>
                        <button onClick={() => setCurrView(1)}>Pull Requests</button>
                        <button onClick={() => setCurrView(2)}>Branches</button>
                    </div>
                    {currView === 0 && <Commits repo={repo} />}
                    {currView === 1 && <Pulls repo={repo} />}
                    {currView === 2 && <Branches repo={repo} />}
                </React.Fragment>}
        </div>
    );
}

export default VersionControlUpdates;