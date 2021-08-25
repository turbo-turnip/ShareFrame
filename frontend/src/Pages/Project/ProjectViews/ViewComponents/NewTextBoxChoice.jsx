import React, { useState } from 'react';

const useForceUpdate = () => {
    const [ value, setValue ] = useState(0);
    return () => setValue(value => value + 1);
}

const NewTextBoxChoice = ({ choiceTitle, choiceDesc, removeQuestion }) => {
    const forceUpdate = useForceUpdate();
    const [ title, setTitle ] = useState(choiceTitle);
    const [ desc, setDesc ] = useState(choiceDesc);
    const [ input, setInput ] = useState("Text Box Choice");

    return (
        <div className="new-textbox-choice">
            <div className="x" onClick={removeQuestion}>&times;</div>
            <div className="input-field">
                <label>Question</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="input-field">
                <label>Question Description</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
    );
}

export default NewTextBoxChoice;