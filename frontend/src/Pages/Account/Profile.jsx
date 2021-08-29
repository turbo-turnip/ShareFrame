import React from 'react';

const Profile = ({ account }) => {
    return (
        <div className="input-field pfp">
            <label>Profile Picture</label>
            <div>
                <img src={account.pfp} alt={account.user_name} />
                <input type="file" />
                <button>Update</button>
            </div>
        </div>
    );
}

export default Profile;