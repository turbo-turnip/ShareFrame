import React, { useState, useEffect } from 'react';
import CreatePollQuestion from './CreatePollQuestion';
import NewSingleChoice from './NewSingleChoice';

const useForceUpdate = () => {
    const [ value, setValue ] = useState(0);
    return () => setValue(value => value + 1);
}

const NewPoll = ({  }) => {
    const forceUpdate = useForceUpdate();
    const [ questions, setQuestions ] = useState([]);
    const [ newQuestion, setNewQuestion ] = useState(false);

    return (
        <div className="new-poll">
            <h1>New Poll</h1>
            <div className="input-field">
                <label>Poll Title</label>
                <input type="text" placeholder="e.g. New Frontend Framework" />
            </div>
            <div className="input-field">
                <label>Poll Description</label>
                <input type="text" placeholder="e.g. We are thinking about switching frontend frameworks..." />
            </div>
            <CreatePollQuestion setQuestions={setQuestions} />
            <div className="poll-questions">
                {questions.length !== 0 ? 
                    questions.map((question, i) =>
                        question.type === "Single" ? 
                            <NewSingleChoice 
                                choiceTitle={question.title} 
                                choiceDesc={question.desc}
                                questions={questions}
                                removeQuestion={() => {
                                    let tmp = questions;
                                    tmp.splice(i, 1);
                                    setQuestions(tmp);
                                    forceUpdate();
                                }}
                                questionIndex={i} /> : ""
                    ) 
                    :
                    <h1>There's no questions yet; make some!</h1>}
            </div>
        </div>
    );
}

export default NewPoll;