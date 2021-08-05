import React, { useState, useEffect, useRef } from 'react';

const Popup = ({ type, message }) => {
    const popupRef = useRef();
    const [ displayed, setDisplayed ] = useState(false);

    useEffect(() => {
        if (displayed) {
            popupRef.current.style.transform = "translate(-50%, 0%)";
        } else {
            popupRef.current.style.transform = "translate(-50%, -200%)";
        }
    }, [ displayed ]);

    useEffect(() => {
        setTimeout(() => {
            setDisplayed(true);
        }, 100);
        
        setTimeout(() => {
            setDisplayed(false);
        }, 5 * 1000);
    }, []);

    return (
        <div className={`popup popup-${type}`} ref={popupRef}>
            <h4>{message}</h4>
        </div>
    );
}

export default Popup;