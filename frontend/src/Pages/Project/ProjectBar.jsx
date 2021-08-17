import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProjectBar = ({ loading, project, owner }) => {
    const [ curr, setCurr ] = useState(0);
    const [ scrollLeft, setScrollLeft ] = useState(0);
    const barRef = useRef();

    const scrubLeft = () => {
        const bar = barRef.current;
        const width = bar.getBoundingClientRect().width;
        const lastChild = bar.lastElementChild.getBoundingClientRect();

        if (lastChild.x + lastChild.width + 30 > width) {
            let amt = 0;

            const interval = setInterval(() => {
                if (amt <= 200) {
                    setScrollLeft(prevState => prevState + 1);
                    amt++;
                } else 
                    clearInterval(interval);
            }, 1);
        }
    }

    const scrubRight = () => {
        const bar = barRef.current;
        const firstChild = bar.firstChild.getBoundingClientRect();

        if (firstChild.x - firstChild.width - 30 < 0) {
            let amt = 0;

            const interval = setInterval(() => {
                if (amt >= -200) {
                    setScrollLeft(prevState => prevState - 1);
                    amt--;
                } else 
                    clearInterval(interval);
            }, 1);
        }
    }

    useEffect(() => {
        barRef.current.scrollLeft = scrollLeft;
    }, [ scrollLeft ]);

    return (
        <div className="project-bar" ref={barRef}> 
            <div className="navigate navigate-left" onClick={scrubRight}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </div>
            <div className={`option ${curr === 0 ? "curr" : ""}`}>
                {project && <Link to={`/project?name=${project.project_title}&user=${project.user_name}`}>Page</Link>}
            </div>
            {project ? project.allow_feedback === 'TRUE' &&
                <div className={`option ${curr === 1 ? "curr" : ""}`}>
                    {<Link to={`/project/feedback?name=${project.project_title}&user=${project.user_name}`}>Feedback</Link>}
                </div> : ""}
            {project ? project.allow_threads === 'TRUE' &&
                <div className={`option ${curr === 2 ? "curr" : ""}`}>
                    {<Link to={`/project/threads?name=${project.project_title}&user=${project.user_name}`}>Threads</Link>}
                </div> : ""}
            {project ? project.allow_reviews === 'TRUE' &&
                <div className={`option ${curr === 3 ? "curr" : ""}`}>
                    {<Link to={`/project/reviews?name=${project.project_title}&user=${project.user_name}`}>Reviews</Link>}
                </div> : ""}
            <div className={`option ${curr === 4 ? "curr" : ""}`}>
                {project && <Link to={`/project/bugs?name=${project.project_title}&user=${project.user_name}`}>Bugs</Link>}
            </div>
            <div className={`option ${curr === 5 ? "curr" : ""}`}>
                {project && <Link to={`/project/polls?name=${project.project_title}&user=${project.user_name}`}>Polls</Link>}
            </div>
            {project ? project.version_control === 'TRUE' &&
                <div className={`option ${curr === 6 ? "curr" : ""}`}>
                    {<Link to={`/project/version-control?name=${project.project_title}&user=${project.user_name}`}>Version Control</Link>}
                </div> : ""}
            <div className={`option ${curr === 7 ? "curr" : ""}`}>
                {project && <Link to={`/project/events?name=${project.project_title}&user=${project.user_name}`}>Events</Link>}
            </div>
            {project ? owner &&
                <div className={`option ${curr === 8 ? "curr" : ""}`}>
                    {<Link to={`/project/settings?name=${project.project_title}&user=${project.user_name}`}>Settings</Link>}
                </div> : ""} 
            <div className="navigate navigate-right" onClick={scrubLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>    
            </div>
        </div>
    );
}

export default ProjectBar;