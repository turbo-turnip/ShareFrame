import React, { useState, useEffect } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../../PATH';
import Popup from '../../../Components/Popup';
import BugPopup from './ViewComponents/BugPopup';
import Bug from './ViewComponents/Bug';

const toBase64 = (file) => {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result);
    });
}

const convertFilesToBase64 = (files) => {
	return new Promise((res) => {
		const base64 = [];
		Object.keys(files).forEach(async (_, i) => {
			const output = await toBase64(files[i]);
			base64.push(output);
			if (i + 1 === Object.keys(files).length)
				res(base64);
		});
	});
}

const Reviews = ({ error, project, owner, loggedIn, account }) => {
    const [ newBugPopup, setNewBugPopup ] = useState(false);
    const [ bugs, setBugs ] = useState(project && project.bugs ? project.bugs : []);
    const [ successPopup, setSuccessPopup ] = useState(false);
    const [ errorPopup, setErrorPopup ] = useState(false);
    const [ versions, setVersions ] = useState([]);
    const [ member, setMember ] = useState(false);

    const newBugHandler = async (e) => {
        const [ title, summary, version, screenshots ] = e.target.querySelectorAll("input, select");

        const password = prompt('Please enter your user password', '');

        if (Object.keys(screenshots.files).length > 3) {
            setErrorPopup("You can send up to 3 screenshots");
            setNewBugPopup(false);
            setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
        } else {
            let screenshotsBase64 = -1;
            if (Object.keys(screenshots.files).length > 0)
                screenshotsBase64 = await convertFilesToBase64(screenshots.files);

            const request = await fetch(join(BACKEND_PATH, "/project/reportBug"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: account.user_name,
                    pfp: account.pfp,
                    projectCreator: project.user_name,
                    password,
                    projectTitle: project.project_title,
                    title: title.value,
                    summary: summary.value,
                    version: version.value,
                    screenshots: screenshotsBase64 !== -1 ? screenshotsBase64 : []
                })
            });

            const response = await request.json();

            if (request.status !== 201) {
                setErrorPopup(response.message);
                setNewBugPopup(false);
                setTimeout(() => setErrorPopup(false), 5000 * 1 + 200);
            } else {
                setSuccessPopup(response.message);
                setNewBugPopup(false);
                setTimeout(() => setSuccessPopup(false), 5000 * 1 + 200);
                setBugs(response.bugs);
            }
        }
    }

    useEffect(() => {
        if (project) {
            if (project.bugs)
                setBugs(project.bugs);
            
            if (project.announcements) {
                let announcementVersions = [];
                project.announcements.forEach(announcement => 
                    !announcementVersions.includes(announcement.version) && 
                        announcementVersions.push(announcement.version));

                setVersions(announcementVersions.sort((a, b) => b.charAt(0) - a.charAt(0)));
            }

            if (project.members && account)
                project.members.forEach(member => member.user_name === account.user_name ? setMember(true) : null);
        }
    }, [ project ]);

    return (
        <div className="project-bugs">
            {successPopup && <Popup type="success" message={successPopup} />}
            {errorPopup && <Popup type="error" message={errorPopup} />}
            {newBugPopup && <BugPopup closeHandler={() => setNewBugPopup(false)} submitHandler={newBugHandler} versions={versions} />}
            {error && <h1 className="url-error">{error}</h1>}
            {!error && 
                <React.Fragment>
                    <h1>Bugs{loggedIn && <button onClick={() => setNewBugPopup(true)}>Report a bug</button>}</h1>
                    {bugs.length !== 0 ? bugs.map(bug => <Bug bug={bug} member={member} project={project} account={account} setBugs={setBugs} />) : <h1 className="no-bugs-message">This is where bugs will appear!</h1>}
                </React.Fragment>}
        </div>
    );
}

export default Reviews;