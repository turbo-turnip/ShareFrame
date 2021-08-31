import React, { useEffect, useRef, useState } from 'react';
import Commits from './Commits';
import Pulls from './Pulls';
import Branches from './Branches';

const VersionControlUpdates = ({ repo }) => {
    const [ currView, setCurrView ] = useState(0);
    const [ innerWidth, setInnerWidth ] = useState(window.innerWidth);
    const [ count, setCount ] = useState([ 0, 0, 0 ]);

    useEffect(() => window.addEventListener('resize', e => setInnerWidth(window.innerWidth)), []);

    return (
        <div className="version-control-updates" style={{ width: `calc(${innerWidth - 320 - 20}px - 4em)` }}>
            {repo &&
                <React.Fragment>
                    {console.log(repo)}
                    <div className="view-selection">
                        <button onClick={() => setCurrView(0)}>Commits{(currView === 0 && ` (${count[0]})`)}</button>
                        <button onClick={() => setCurrView(1)}>Pull Requests{(currView === 1 && ` (${count[1]})`)}</button>
                        <button onClick={() => setCurrView(2)}>Branches{(currView === 2 && ` (${count[2]})`)}</button>
                    </div>
                    {currView === 0 && <Commits repo={repo} setCount={setCount} />}
                    {currView === 1 && <Pulls repo={repo} setCount={setCount} />}
                    {currView === 2 && <Branches repo={repo} setCount={setCount} />}
                </React.Fragment>}
        </div>
    );
}

export default VersionControlUpdates;