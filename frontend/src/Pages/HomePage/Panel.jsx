import React from 'react';

const Panel = ({ title, description, image, alt }) => {
    return (
        <div className="panel">
            <div className="panel-content">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <img src={image} alt={alt} />
        </div>
    );
}

export default Panel;