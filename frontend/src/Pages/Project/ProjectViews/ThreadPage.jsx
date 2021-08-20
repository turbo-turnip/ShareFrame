import React, { useState, useEffect, useRef } from 'react';
import { BACKEND_PATH, FRONTEND_PATH, join } from '../../../PATH';
import isLoggedIn from '../../../IsLoggedIn';
import Nav from '../../../Components/Nav';
import Popup from '../../../Components/Popup';

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const socket = new WebSocket(BACKEND_PATH.replace(/http[s]?:\/\//gi, 'ws://'));

socket.onopen = () => console.log('Socket opened!');

const ThreadPage = () => {
    const threadMessagesRef = useRef();
    const threadPaneRef = useRef();
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ account, setAccount ] = useState();
    const [ owner, setOwner ] = useState(false);
    const [ project, setProject ] = useState();
    const [ thread, setThread ] = useState();
    const [ threadMessages, setThreadMessages ] = useState(project && thread ? thread.messages : []);
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ alreadyListening, setAlreadyListening ] = useState(false);
    const [ closeError, setCloseError ] = useState(false);

    const closeThreadHandler = () => {
        if (thread && project) {
            if (window.confirm("Are you sure you want to close this thread?")) {
                socket.send(JSON.stringify({
                    type: "close-thread",
                    user: account.user_name, 
                    pfp: account.pfp,
                    threadSubject: thread.subject, 
                    threadDesc: thread.desc, 
                    threadCreated: thread.date_created,
                    projectTitle: project.project_title,
                    projectCreator: project.user_name
                }));
            }
        }
    }

    const fetchProject = async (user, name) => {
        const request = await fetch(join(BACKEND_PATH, "/project/getProject"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user, name
            })
        });
        const response = await request.json();

        setLoading(false);

        if (request.status === 200) {
            setProject(response.project);
        } else 
            setError(response.message);
    }

    useEffect(() => {
        isLoggedIn(window.localStorage)
            .then(res => {
                console.log(res);
                if (res.loggedIn) {
                    setLoggedIn(true);
                    setAccount(res.account);
                } else {
                    document.location.href = join(FRONTEND_PATH, "/register");
                }
            });
    }, []);

    useEffect(() => {
        if (searchParams.has("name") && searchParams.has("user")) {
            fetchProject(searchParams.get("user"), searchParams.get("name"));
        } else 
            setError("Project must have owner and title");

        if (!searchParams.has("thread_subject") && !searchParams.has("thread_creator"))
            setError("Thread must have subject and creator");
    }, []);

    useEffect(() => {
        if (project) {
            if (localStorage.hasOwnProperty("at")) {
                const at = localStorage.getItem("at");
                fetch(join(BACKEND_PATH, "/auth/validateToken"), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: at
                    })
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.account) {
                            setOwner(res.account.user_pass === project.user_pass)
                        }
                    });
            }
        }

        if (project && !error) {
            let found = false;
            
            if (project.threads && project.threads.length !== 0)
                project.threads.forEach(threadEntry => {
                    if (threadEntry.subject === searchParams.get("thread_subject") && threadEntry.user === searchParams.get("thread_creator")) {
                        setThread(threadEntry);
                        found = true;
                    }
                });

            if (!found && !loading)
                setError("Thread not found");
        }
    }, [ project, loading, error ]);

    useEffect(() => {
        if (thread && !alreadyListening) {
            setAlreadyListening(true);
            socket.addEventListener('message', (e) => {
                console.log('new data');
                const data = JSON.parse(e.data);
                if (data.type === "thread-message") {
                    console.log(data.data);
                    setThreadMessages(prevState => [ ...prevState, data.data ]);
                } else if (data.type === "close-error") {
                    setCloseError(data.message);
                    setTimeout(() => setCloseError(false), 1 * 5000 + 200);
                }
            });

            window.addEventListener('beforeunload', (e) => {
                e.preventDefault();

                socket.send(JSON.stringify({
                    type: "save-thread",
                    messages: threadMessagesRef.current,
                    projectTitle: project.project_title,
                    projectCreator: project.user_name,
                    threadSubject: thread.subject,
                    threadDesc: thread.desc,
                    threadCreated: thread.date_created
                }));

                e.returnValue = " ";
            });
        }
    }, [ thread, threadMessages, project ]);

    useEffect(() => {
        threadMessagesRef.current = threadMessages;
        if (threadPaneRef.current)
            threadPaneRef.current.scrollTop = threadPaneRef.current.scrollHeight;
    }, [ threadMessages ]);

    useEffect(() => {
        if (thread && thread.messages)
            setThreadMessages(thread.messages);
    }, [ thread ]);

    return (
        <React.Fragment>
            {error && <h1 className="url-error">{error}</h1>}
            <Nav isLoggedIn={loggedIn} account={account} />
            {closeError && <Popup type="error" message={closeError} />}
            {!error && thread && account && 
                <div className="thread-page">
                    <div className="thread-info">
                        {thread && <h1 data-date-created={thread.date_created}>{thread.subject}</h1>}
                        {thread && <p>{thread.desc}</p>}
                    </div>

                    {!error && thread &&
                        <div className="thread-messages" ref={threadPaneRef}>
                            {threadMessages && threadMessages.map(message => 
                                <div className="thread-message" style={{
                                    background: message.user === account.user_name ? "rgb(36, 182, 255)" : "rgb(43, 61, 82)",
                                    position: "relative",
                                    left: message.user === account.user_name ? "100%" : "0%",
                                    transform: message.user === account.user_name && "translateX(-100%)",
                                    marginLeft: message.user === account.user_name ? "-1.5em" : "1.5em",
                                }}>
                                    <div className="top">
                                        <img src={message.pfp} alt={message.user} />
                                        <span><b>{message.user}</b></span>
                                    </div>
                                    <p>{message.message}</p>
                                </div>)}
                        </div>}

                    <form className="thread-message-input" onSubmit={(e) => {
                        e.preventDefault(); 

                        console.log('submitting data');

                        socket.send(JSON.stringify({
                            type: "thread-message",
                            user: account.user_name, 
                            pfp: account.pfp, 
                            message: e.target.querySelector("input").value, 
                            threadSubject: thread.subject, 
                            threadDesc: thread.desc, 
                            threadCreated: thread.date_created
                        }));

                        e.target.querySelector("input").value = "";
                    }}>
                        <input type="text" placeholder="Send a message to the thread..." maxLength="400" required />
                        <button type="submit">Send</button>
                        <button type="button" onClick={closeThreadHandler}>Close Thread</button>
                    </form>
                </div>}
        </React.Fragment>
    );
}

export default ThreadPage;