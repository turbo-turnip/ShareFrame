import React from 'react';

const QuestionAnswer = ({ answer }) => {
    return (
        <React.Fragment>
            <h4>Question: <span>{answer.title}</span></h4>
            <h4>Description: <span>{answer.desc}</span></h4>
            {answer.type === "Single" ?
                <h4>Answer: <span>{
                    answer.responses.filter(response => response.selected === "true").length > 0 ? 
                        answer.responses.filter(response => response.selected === "true")[0].value.replace('^', "'") : "No response"}</span></h4>
                :
            answer.type === "TextBox" ?
                <h4>Answer: <span>{answer.responses[0].value.replace('^', "'")}</span></h4>
                :
            answer.type === "Multiple" ?
                <h4>Answer{answer.responses.length !== 1 && "s"}: <span>{
                    answer.responses.filter(response => response.selected === "true").length > 0 ? 
                        answer.responses.filter(response => response.selected === "true").map(res => res.value).join(', ').replace('^', "'") : "No response"}</span></h4>
                : <h1>No responses!</h1>}
        </React.Fragment>
    );
}

export default QuestionAnswer;