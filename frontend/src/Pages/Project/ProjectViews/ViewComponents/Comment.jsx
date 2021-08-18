import React, { useEffect, useState } from 'react';
import { BACKEND_PATH, join } from '../../../../PATH';

const Comment = ({ comment, user, pfp, announcement, project }) => {
    const [ upvotes, setUpvotes ] = useState(comment && comment.upvotes && (comment.upvotes.length ? comment.upvotes.length : 0));
    const [ downvotes, setDownvotes ] = useState(comment && comment.downvotes && (comment.downvotes.length ? comment.downvotes.length : 0));

    const upvoteHandler = async () => {
        const request = await fetch(join(BACKEND_PATH, "/project/upvoteComment"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment: comment.comment,
                commentCreator: comment.user, 
                user, pfp, 
                commentUserPfp: comment.pfp, 
                announcementName: announcement.title, 
                title: project.project_title, 
                projectCreator: project.user_name, 
                announcementContent: announcement.desc
            })
        });

        const response = await request.json();

        if (request.status === 200) {
            if (response.status === "REMOVED")
                setUpvotes(prevState => prevState - 1);
            else 
                setUpvotes(prevState => prevState + 1);

            comment.upvotes = upvotes;
        }
    }

    const downvoteHandler = async () => {
        const request = await fetch(join(BACKEND_PATH, "/project/downvoteComment"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment: comment.comment,
                commentCreator: comment.user, 
                user, pfp, 
                commentUserPfp: comment.pfp, 
                announcementName: announcement.title, 
                title: project.project_title, 
                projectCreator: project.user_name, 
                announcementContent: announcement.desc
            })
        });

        const response = await request.json();

        if (request.status === 200) {
            if (response.status === "REMOVED")
                setDownvotes(prevState => prevState - 1);
            else 
                setDownvotes(prevState => prevState + 1);

            comment.downvotes = downvotes;
        }
    }

    useEffect(() => {
        if (comment) {
            comment.upvotes &&
                setUpvotes(comment.upvotes.length);
            comment.downvotes &&
                setDownvotes(comment.downvotes.length);
        }
    }, [ comment ]);

    useEffect(() => {
        console.log(upvotes);
    }, [ upvotes ]);

    return (
        <React.Fragment>
            {comment && 
                <div className="announcement-comment">
                    <img src={comment.pfp} alt={comment.user} />
                    <span>{comment.user}</span>
                    <p>{comment.comment}</p>
                    <div className="vote">
                        <div className="upvote" onClick={upvoteHandler}></div>
                        <div className="vote-count">{(upvotes ? upvotes : 0) - (downvotes ? downvotes : 0)}</div>
                        <div className="downvote" onClick={downvoteHandler}></div>
                    </div>
                </div>}
        </React.Fragment>
    );
}

export default Comment;