import React, { useState } from 'react';

const useForceUpdate = () => {
    const [ value, setValue ] = useState(0);
    return () => setValue(value => value + 1);
}

const NewMultipleChoice = ({ choiceTitle, choiceDesc, removeQuestion }) => {
    const forceUpdate = useForceUpdate();
    const [ title, setTitle ] = useState(choiceTitle);
    const [ desc, setDesc ] = useState(choiceDesc);
    const [ choices, setChoices ] = useState([
        { selected: false, value: "Choice 1" },
        { selected: false, value: "Choice 2" }
    ]);

    return (
        <div className="new-multiple-choice">
            <div className="x" onClick={removeQuestion}>&times;</div>
            <div className="input-field">
                <label>Question</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="input-field">
                <label>Question Description</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            {choices.map((choice, i) => 
                <div className="choice">
                    <input type="checkbox" className="poll-checkbox" checked={choice.selected} onChange={(e) => {
                        let tmp = choices;
                        tmp[i].selected = e.target.checked;

                        setChoices(tmp);
                        forceUpdate();
                    }} />
                    <input type="text" value={choice.value} onChange={(e) => {
                        let tmp = choices;
                        tmp[i].value = e.target.value;

                        setChoices(tmp);
                        forceUpdate();
                    }} />
                    {i === choices.length - 1 &&
                        <span onClick={() => setChoices(prevState => [ ...prevState, { selected: false, value: "Choice " + (prevState.length + 1) }])}>&#43;</span>}
                </div>)}
        </div>
    );
}

export default NewMultipleChoice;