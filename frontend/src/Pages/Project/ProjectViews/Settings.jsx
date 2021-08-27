import React from 'react';

const Settings = ({ project, account, error }) => {
    return (
        <div className="project-settings">
            {error && <h1 className="url-error">{error}</h1>}
            {!error &&
                <React.Fragment>
                    <h1>Project Settings</h1>
                </React.Fragment>}
        </div>
    );
}

export default Settings;