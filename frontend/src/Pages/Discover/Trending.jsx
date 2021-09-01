import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../PATH';

const Trending = () => {
    const [ projects, setProjects ] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const request = await fetch(join(BACKEND_PATH, "/discover/trending"));
            const response = await request.json();

            if (request.status === 200) setProjects(response.trending);
        }

        fetchProjects();
    }, []);

    return (
        <React.Fragment>
            {projects && projects.map(project => 
                <div className="project" onClick={() => document.location.href = join(FRONTEND_PATH, "/project?name=" + project.project_title + "&user=" + project.user_name)}>
                    <h4>{project.project_title}</h4>
                    <p className="project-count">{project.supporters.length}</p>
                    <span>Supporter{project.supporters.length !== 1 && "s"}</span>
                </div>)}
        </React.Fragment>
    );
}

export default Trending;