import React, { useEffect } from 'react';

const ProjectBanner = ({ viewsCount, loading, setViewsCount, project }) => {
    useEffect(() => {
        if (project) {
            let supporters = project.supporters.length,
                members = project.members.length,
                feedback = project.feedback.length,
                threads = project.threads.length,
                reviews = project.reviews.length;

            fetch(`https://api.github.com/repos/SoftwareFuze/ShareFrame/commits`)
                .then(res => res.json())
                .then(res => {
                    setViewsCount({ supporters, members, feedback, threads, reviews, commits: res.length });
                });
        }
    }, [ project ]);

    return (
        <div className="project-banner">
            <img src="/media/project-banner.svg" alt="Project" />
            <h1>{loading ? "Loading..." : (project) && project.project_title}</h1>
            <h4>{loading ? "Loading..." : (project) && project.project_desc_short}</h4>
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