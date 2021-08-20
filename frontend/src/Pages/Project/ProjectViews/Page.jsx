import React from 'react';
import ProjectBanner from './ViewComponents/ProjectBanner';
import ProjectPane from './ViewComponents/ProjectPane';

const Page = ({ error, viewsCount, loading, setViewsCount, project, owner, loggedIn, account, setCurrView }) => {
    return (
        <div className="project-page">
            {error && <h1 className="url-error">{error}</h1>}
            {!error && 
                <React.Fragment>
                    <ProjectBanner viewsCount={viewsCount} loading={loading} setViewsCount={setViewsCount} project={project} />
                    <ProjectPane setCurrView={setCurrView} project={project} owner={owner} loggedIn={loggedIn} account={account} />
                </React.Fragment>
            }
        </div>
    );
}

export default Page;