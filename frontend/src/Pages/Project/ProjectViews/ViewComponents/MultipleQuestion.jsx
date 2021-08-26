import React, { useState, useRef, useEffect } from 'react';

const useForceUpdate = () => {
    const [ value, setValue ] = useState(0);
    return () => setValue(value => value + 1);
}

const MultipleQuestion = ({ question, answered, setAnswered, index }) => {
    const forceUpdate = useForceUpdate();
    const [ choices, setChoices ] = useState(question && question.choices && JSON.parse(question.choices));

    useEffect(() => {
        setChoices(prevState => prevState.map(value => { 
            return { selected: false, value }
        }));
    }, []);

    useEffect(() => {
        let selected = false;
        choices.forEach(choice => choice.selected ? selected = true : null);

        let tmp = answered;
        tmp[index] = selected;
        setAnswered(tmp);
    }, [ choices ]);

    return (
        <div className="multiple-choice">
            <h4>{question.title}</h4>
            <p>{question.desc}</p>
            {choices.map((choice, i) => 
                <div className="choice">
                    <input type="checkbox" className="poll-checkbox" onClick={(e) => {
                        setChoices((prevState) =>
                            prevState.map((c, i) =>
                                i === index ?
                                    { value: c.value, selected: e.target.checked }
                                    : prevState[i]));
                        forceUpdate();
                    }} />
                    <label>{choice.value}</label>
                </div>)}
        </div>
    );
}

export default MultipleQuestion;