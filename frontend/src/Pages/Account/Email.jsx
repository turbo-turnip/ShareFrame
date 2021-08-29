import React from 'react';

const Email = ({ account }) => {
    return (
        <div className="input-field">
            <label>Email</label>
            <div>
                <input type="text" defaultValue={account.user_email} />
                <button>Update</button>
            </div>
        </div>
    );
}

export default Email;