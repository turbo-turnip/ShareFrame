import React from 'react';

const CreatePollQuestion = ({ setQuestions }) => {
    return (
        <div className="create-poll-question">
            <button data-tooltip="Add Single Choice" onClick={() => setQuestions(prevState => [ { type: "Single", title: "New Single Choice", desc: "New Single Choice question." }, ...prevState ])}>
                <img src="/media/single-choice.svg" alt="Single Choice" />
            </button>
            <button data-tooltip="Add Text Box">
                <img src="/media/input-choice.svg" alt="Text Box" />
            </button>
            <button data-tooltip="Add Multiple Choice">
                <img src="/media/multiple-choice.svg" alt="Multiple Choice" />
            </button>
        </div>
    );
}

export default CreatePollQuestion;