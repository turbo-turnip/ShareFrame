import React from 'react';

const Comment = ({ comment }) => {
    return (
        <React.Fragment>
            {comment && 
                <div className="announcement-comment">
                    <img src={comment.pfp} alt={comment.user} />
                    <span>{comment.user}</span>
                    <p>{comment.comment}</p>
                    <div className="vote">
                        <div className="upvote"></div>
                        <div className="vote-count">{comment.votes ? comment.votes : 0}</div>
                        <div className="downvote"></div>
                    </div>
                </div>}
        </React.Fragment>
    );
}

export default Comment;