import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../PATH';

const Trending = () => {
    const [ projects, setProjects ] = useState([]);
    const [ loadMore, setLoadMore ] = useState(0);
    const [ stopLoading, setStopLoading ] = useState(false);
    const [ projectsToShow, setProjectsToShow ] = useState([]);
    const [ searchInput, setSearchInput ] = useState("");      

    useEffect(() => {
        const fetchProjects = async () => {
            const request = await fetch(join(BACKEND_PATH, "/discover/projects/" + (projects.length + 10).toString() + "/" + (projects.length)));
            const response = await request.json();

            if (request.status === 200) {
                setProjects(response.projects);
                setProjectsToShow(response.projects);
            } else if (request.status === 429) setStopLoading(true);
        }

        fetchProjects();
    }, [ loadMore ]);

    useEffect(() => setProjectsToShow(projects), [ projects ]);

    useEffect(() => {
        if (searchInput !== "") {
            const accuracy = searchInput.length / 5 * 3;
            let matches = [];
            
            projects.forEach(project => {
                let matched = 0;
                
                Array.from(searchInput).forEach(char => {
                    if (project.project_title.includes(char.toUpperCase()) || project.project_title.includes(char.toLowerCase()))
                        matched++;
                    else if (project.project_desc.includes(char.toUpperCase()) || project.project_desc.includes(char.toLowerCase()))
                        matched += 2;
                });

                if (matched >= Math.ceil(accuracy))
                    matches.push({ ...project, hierarchy: matched });
            });

            setProjectsToShow(matches.sort((a, b) => b.hierarchy - a.hierarchy));
        }
    }, [ searchInput, projects ]);

    return (
        <React.Fragment>
            <div className="filter-projects">
                <input type="text" placeholder="Search projects..." />
                <button onClick={(e) => setSearchInput(e.target.previousSibling.value)}>Search</button>
            </div>
            <div className="discover-projects">
                {projectsToShow && projectsToShow.map(project => 
                    <div className="project" onClick={() => document.location.href = join(FRONTEND_PATH, "/project?name=" + project.project_title + "&user=" + project.user_name)}>
                        <h4>{project.project_title}</h4>
                        <p className="project-count">{project.supporters ? project.supporters.length : 0}</p>
                        <span>Supporter{project.supporters ? (project.supporters.length !== 1 && "s") : "s"}</span>
                    </div>)}
            </div>

            {!stopLoading && <button onClick={() => setLoadMore(prevState => prevState + 1)}>Load more</button>}
        </React.Fragment>
    );
}

export default Trending;