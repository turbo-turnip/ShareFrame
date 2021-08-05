const PATH = {};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    PATH.FRONTENT_PATH = "http://localhost:3000";
    PATH.BACKEND_PATH = "http://localhost:8000";
} else {
    PATH.FRONTEND_PATH = "[the frontend domain eventually]";
    PATH.BACKEND_PATH = "[the backend domain eventually]";
}

PATH.join = (PATH, ENDPOINT, OTHERS = []) => {
    return PATH + ENDPOINT + OTHERS.join('');
}

PATH.ENV = process.env.NODE_ENV;

module.exports = PATH;