import React from 'react';

const Username = ({ account }) => {
    return (
        <div className="input-field">
            <label>Username</label>
            <div>
                <input type="text" defaultValue={account.user_name} />
                <button>Update</button>
            </div>
        </div>
    );
}

export default Username;