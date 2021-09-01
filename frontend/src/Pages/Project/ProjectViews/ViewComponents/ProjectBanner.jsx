import React, { useEffect, useState } from 'react';
import { join, BACKEND_PATH } from '../../../../PATH';

const ProjectBanner = ({ viewsCount, loading, setViewsCount, project, account, loggedIn }) => {
    const [ supporting, setSupporting ] = useState(false);

    const supportChangeHandler = async () => {
        if (supporting) {
            const request = await fetch(join(BACKEND_PATH, "/project/removeSupport"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name, 
                    pfp: account.pfp, 
                    projectCreator: project.user_name, 
                    projectTitle: project.project_title
                })
            });

            const response = await request.json();

            if (request.status === 201) setSupporting(false);
        } else if (!supporting) {
            const request = await fetch(join(BACKEND_PATH, "/project/support"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name, 
                    pfp: account.pfp, 
                    projectCreator: project.user_name, 
                    projectTitle: project.project_title
                })
            });

            const response = await request.json();

            if (request.status === 201) setSupporting(true);
        }
    }

    useEffect(() => {
        if (project) {
            let supporters = project.supporters.length,
                members = project.members.length,
                feedback = project.feedback.length,
                threads = project.threads.length,
                reviews = project.reviews.length;

            if (account)
                project.supporters.forEach(supporter => supporter.user === account.user_name && setSupporting(true));

            fetch(`https://api.github.com/repos/SoftwareFuze/ShareFrame/commits?per_page=500`)
                .then(res => res.json())
                .then(res => {
                    setViewsCount({ supporters, members, feedback, threads, reviews, commits: res.length });
                });
        }
    // eslint-disable-next-line
    }, [ project ]);

    return (
        <div className="project-banner">
            <img src="/media/banner.svg" alt="Project" />
            <h1>{loading ? "Loading..." : (project) && project.project_title}</h1>
            <h4>{loading ? "Loading..." : (project) && project.project_desc_short}</h4>
            {loggedIn && <button className="support" onClick={supportChangeHandler}>{supporting ? "Remove Support" : "Support This Project"}</button>}
            <div className="banner-views">
                <span className="supporters">Supporters <h4 className="count">{viewsCount.supporters}</h4></span>
                <span className="members">Members <h4 className="count">{viewsCount.members}</h4></span>
                {loading ? "Loading..." : (project) && project.allow_feedback === 'TRUE' ? <span className="feedback">Feedback <h4 className="count">{viewsCount.feedback}</h4></span> : ""}
                {loading ? "Loading..." : (project) && project.allow_threads === 'TRUE' ? <span className="threads">Threads <h4 className="count">{viewsCount.threads}</h4></span> : ""}
                {loading ? "Loading..." : (project) && project.allow_reviews === 'TRUE' ? <span className="reviews">Reviews <h4 className="count">{viewsCount.reviews}</h4></span> : ""}
                {loading ? "Loading..." : (project) && project.version_control === 'TRUE' ? <span className="commits">Commits <h4 className="count">{viewsCount.commits}</h4></span> : ""}
            </div>
        </div>
    );
}

export default ProjectBanner;