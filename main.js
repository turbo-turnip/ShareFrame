// require all modules
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.route');
const projectRouter = require('./routes/project.route');
const WebSocket = require('ws');
const { pool: db } = require('./database');

// necessary setup
const app = express();
require('dotenv').config();

const corsConfig = {
    origin: !process.env.NODE_ENV ? "http://localhost:3000" : "[this is where the hosted domain will go for the frontend]"
};

// necessary middleware
app.use(cors(corsConfig));
app.use(express.json({ limit: '100mb' }));

app.use('/auth', authRouter);
app.use('/project', projectRouter);

// main ReST API
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the ShareFrame ReST API" });
});

const server = app.listen(process.env.PORT || 8000, () => console.log('Server running...'));

const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
    console.log('user connected');

    socket.on('message', (data, binary) => {
        data = JSON.parse(data.toString());
        if (data.type === "thread-message") 
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: "thread-message", data }), { binary });
                    }
            });
        else if (data.type === "save-thread") {
            db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ data.projectTitle, data.projectCreator ])
                .then(exists => {
                    if (exists.rows.length > 0) {
                        const project = exists.rows[0];
            
                        let threadIndex = -1;
                        project.threads.forEach((thread, i) => {
                            if (thread.subject === data.threadSubject && thread.desc === data.threadDesc && thread.date_created === data.threadCreated) {
                                threadIndex = i;
                            }
                        });

                        if (threadIndex > -1) {
                            project.threads[threadIndex].messages = data.messages;
                            db.query(`UPDATE projects SET threads = '${JSON.stringify(project.threads)}' WHERE project_title = $1 AND user_name = $2 RETURNING threads`, [ data.projectTitle, data.projectCreator ]);
                        } else console.log("Can't find thread");
                    } else console.log("Can't find project");
                });
        } else if (data.type === "close-thread") {
            db.query('SELECT * FROM projects WHERE project_title = $1 AND user_name = $2', [ data.projectTitle, data.projectCreator ])
                .then(exists => {
                    if (exists.rows.length > 0) {
                        const project = exists.rows[0];
            
                        let threadIndex = -1;
                        project.threads.forEach((thread, i) => {
                            if (thread.subject === data.threadSubject && thread.desc === data.threadDesc && thread.date_created === data.threadCreated) {
                                threadIndex = i;
                            }
                        });

                        if (threadIndex > -1) {
                            if (project.threads[threadIndex].user === data.user) {
                                project.threads.splice(threadIndex, 1);
                                db.query(`UPDATE projects SET threads = '${JSON.stringify(project.threads)}' WHERE project_title = $1 AND user_name = $2 RETURNING threads`, [ data.projectTitle, data.projectCreator ]);
                            } else socket.send(JSON.stringify({ type: "close-error", message: "You aren't allowed to close this thread" }));
                        } else console.log("Can't find thread");
                    } else console.log("Can't find project");
                });
        }
    });
});