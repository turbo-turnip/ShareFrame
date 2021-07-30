import React, { useEffect, useRef } from 'react';

const Panel = ({ title, description, image, alt, id }) => {
    const imageRef = useRef(null);

    useEffect(() => {
        window.addEventListener("mousemove", (e) => {
            imageRef.current.style.transform = `translate(calc(30% + ${e.pageX / (id * 50)}px), calc(-30% + ${e.pageY / (id * 100)}px))`;
        });
    }, []);

    return (
        <div className="panel">
            <div className="panel-content">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <img ref={imageRef} src={image} alt={alt} />
        </div>
    );
}

export default Panel;