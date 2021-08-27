import React, { useState, useEffect, useRef } from 'react';

const ProjectBar = ({ updater, currView, project, owner }) => {
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
            <div id="page" className={`option ${currView === "Page" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>/g, ''))}>
                {project && <p>Page</p>}
            </div>
            {project ? project.allow_feedback === 'TRUE' &&
                <div id="feedback" className={`option ${currView === "Feedback" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>/g, ''))}>
                    {<p>Feedback</p>}
                </div> : ""}
            {project ? project.allow_threads === 'TRUE' &&
                <div className={`option ${currView === "Threads" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>/g, ''))}>
                    {<p>Threads</p>}
                </div> : ""}
            {project ? project.allow_reviews === 'TRUE' &&
                <div className={`option ${currView === "Reviews" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>/g, ''))}>
                    {<p>Reviews</p>}
                </div> : ""}
            <div className={`option ${currView === "Bugs" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>/g, ''))}>
                {project && <p>Bugs</p>}
            </div>
            <div className={`option ${currView === "Polls" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>/g, ''))}>
                {project && <p>Polls</p>}
            </div>
            {project ? project.version_control === 'TRUE' &&
                <div className={`option ${currView === "VersionControl" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>| /g, ''))}>
                    {<p>Version Control</p>}
                </div> : ""}
            {project ? owner &&
                <div className={`option ${currView === "Settings" ? "curr" : ""}`} onClick={(e) => updater(e.target.innerHTML.replace(/<p>|<\/p>/g, ''))}>
                    {<p>Settings</p>}
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