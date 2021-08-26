import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';
import ReviewPopup from './ViewComponents/ReviewPopup';
import Review from './ViewComponents/Review';

const Reviews = ({ error, project, owner, loggedIn, account }) => {
    const [ newReviewPopup, setNewReviewPopup ] = useState(false);
    const [ reviews, setReviews ] = useState(project && project.reviews ? project.reviews : []);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);

    const newReviewHandler = async (e) => {
        const [ title, review, rating ] = e.target.querySelectorAll("input");

        const password = prompt('Please enter your user password', '');

        const request = await fetch(join(BACKEND_PATH, "/project/createReview"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reviewTitle: title.value, 
                review: review.value,
                username: account.user_name,
                pfp: account.pfp,
                projectCreator: project.user_name,
                password,
                title: project.project_title,
                reviewRating: rating.value
            })
        });

        const response = await request.json();

        if (request.status !== 201) {
            setErrorPopup(response.message);
            setNewReviewPopup(false);
            setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
        } else {
            setSuccessPopup(response.message);
            setNewReviewPopup(false);
            setTimeout(() => setSuccessPopup(false), 5000 * 1 + 200);
            setReviews(response.reviews);
        }
    }

    useEffect(() => {
        if (project)
            if (project.reviews)
                setReviews(project.reviews);
    }, [ project ]);

    return (
        <div className="project-reviews">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {newReviewPopup && <ReviewPopup closeHandler={() => setNewReviewPopup(false)} submitHandler={newReviewHandler} />}
            {error && <h1 className="url-error">{error}</h1>}
            {!error && 
                <React.Fragment>
                    {console.log(owner)}
                    <h1>Reviews{loggedIn && !owner && <button onClick={() => setNewReviewPopup(true)}>Create New</button>}</h1>
                    {reviews.length !== 0 ? reviews.map(review => <Review review={review} />) : <h1 className="no-reviews-message">This is where reviews will appear!</h1>}
                </React.Fragment>}
        </div>
    );
}

export default Reviews;