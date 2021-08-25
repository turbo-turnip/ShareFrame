import React from 'react';

const CreatePollQuestion = ({ setQuestions, uploadPollHandler }) => {
    return (
        <div className="create-poll-question">
            <button data-tooltip="Add Single Choice" onClick={() => setQuestions(prevState => [ ...prevState, { type: "Single", title: "New Single Choice", desc: "New Single Choice question." } ])}>
                <img src="/media/single-choice.svg" alt="Single Choice" />
            </button>
            <button data-tooltip="Add Text Box" onClick={() => setQuestions(prevState => [ ...prevState, { type: "TextBox", title: "New Text Box Choice", desc: "New Text Box Choice question." } ])}>
                <img src="/media/input-choice.svg" alt="Text Box" />
            </button>
            <button data-tooltip="Add Multiple Choice" onClick={() => setQuestions(prevState => [ ...prevState, { type: "Multiple", title: "New Multiple Choice", desc: "New Multiple Choice question." } ])}>
                <img src="/media/multiple-choice.svg" alt="Multiple Choice" />
            </button>
            <button data-tooltip="Upload Poll" onClick={uploadPollHandler}>
                <img src="/media/upload.svg" alt="Upload Poll" />
            </button>   
        </div>
    );
}

export default CreatePollQuestion;