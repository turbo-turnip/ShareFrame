import React, { useEffect, useRef, useState } from 'react';

const useForceUpdate = () => {
    const [ value, setValue ] = useState(0);
    return () => setValue(value => value + 1);
}

const SingleQuestion = ({ question, index, answered, setAnswered }) => {
    const forceUpdate = useForceUpdate();
    const [ choices, setChoices ] = useState(question && question.choices && JSON.parse(question.choices).map(choice => {
        return { selected: false, value: choice }
    }));

    useEffect(() => {
        let selected = false;
        choices.forEach(choice => choice.selected ? selected = true : null);

        let tmp = answered;
        tmp[index] = selected;
        setAnswered(tmp);
    }, [ choices ]);

    return (
        <div className="single-choice">
            <h4>{question.title}</h4>
            <p>{question.desc}</p>
            {choices.map((choice, i) => 
                <div className="choice">
                    <input type="checkbox" className="poll-checkbox" checked={choice.selected} onClick={(e) => {
                        setChoices((prevState) =>
                            prevState.map((c, i) => 
                                c.value === choice.value ? 
                                    { value: c.value, selected: e.target.checked }
                                    : { value: c.value, selected: false }));
                        forceUpdate();
                    }} />
                    <label>{choice.value}</label>
                </div>)}
        </div>
    );
}

export default SingleQuestion;