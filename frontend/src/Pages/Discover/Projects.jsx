import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../PATH';

const Trending = () => {
    const [ projects, setProjects ] = useState([]);
    const [ loadMore, setLoadMore ] = useState(0);
    const [ stopLoading, setStopLoading ] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            const request = await fetch(join(BACKEND_PATH, "/discover/projects/" + (projects.length + 10).toString() + "/" + (projects.length)));
            const response = await request.json();

            if (request.status === 200) setProjects(response.projects);
            else if (request.status === 429) setStopLoading(true);
        }

        fetchProjects();
    }, [ loadMore ]);

    return (
        <React.Fragment>
            {projects && projects.map(project => 
                <div className="project" onClick={() => document.location.href = join(FRONTEND_PATH, "/project?name=" + project.project_title + "&user=" + project.user_name)}>
                    <h4>{project.project_title}</h4>
                    <p className="project-count">{project.supporters ? project.supporters.length : 0}</p>
                    <span>Supporter{project.supporters ? (project.supporters.length !== 1 && "s") : "s"}</span>
                </div>)}

            {!stopLoading && <button onClick={() => setLoadMore(prevState => prevState + 1)}>Load more</button>}
        </React.Fragment>
    );
}

export default Trending;