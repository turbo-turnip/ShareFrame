import React, { useState, useEffect } from 'react';

const NewTextBoxChoice = ({ question, setAnswered, index, answered }) => {
    const [ input, setInput ] = useState("");

    useEffect(() => {
        setAnswered(prevState => {
            prevState[index] = (input && input !== "") ? true : false;
            return prevState;
        });
    }, [ input ]);

    return (
        <div className="textbox-choice">
            <h4>{question.title}</h4>
            <p>{question.desc}</p>
            <input type="text" placeholder="Answer here..." onChange={(e) => setInput(e.target.value)} />
        </div>
    );
}

export default NewTextBoxChoice;