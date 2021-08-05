import './styles/main.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/Home';
import Register from './Pages/Auth/Register/Register';
import Verify from './Pages/Auth/Verify';

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/register" component={Register} />
                <Route path="/verify" component={Verify} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;