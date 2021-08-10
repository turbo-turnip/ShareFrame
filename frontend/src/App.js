import './styles/main.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/Home';
import Register from './Pages/Auth/Register/Register';
import Login from './Pages/Auth/Login/Login';
import Verify from './Pages/Auth/Verify';
import Create from './Pages/Create/Create';
import Project from './Pages/Project/Project';

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route path="/verify" component={Verify} />
                <Route exact path="/create" component={Create} />
                <Route exact path="/project" component={Project} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;