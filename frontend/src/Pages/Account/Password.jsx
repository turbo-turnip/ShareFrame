import React from 'react';

const Password = ({ account }) => {
    return (
        <div className="input-field pfp">
            <label>New Password</label>
            <div>
                <input type="text" />
                <button>Update</button>
            </div>
        </div>
    );
}

export default Password;