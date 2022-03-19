import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

ReactDOM.render(
  <React.StrictMode>
        <Router>
            { /*Added AuthProvider so that all the functions defined in AuthContext.js will be accessed by components inside AuthProvider*/}
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
  </React.StrictMode>,
  document.getElementById('root')
);