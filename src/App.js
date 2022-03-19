//React Tools
import { Routes, Route } from 'react-router-dom';
//Pages
import Login from './components/Login';
import Home from './components/Home';
import { useAuth } from './auth/AuthContext';

function App() {

    const currentUser = useAuth();

    return (
        <div>
            <Routes>
                <Route path="/Login" element={currentUser.currentUser ? <Home /> : <Login /> } />
                <Route path="/Home" element={currentUser.currentUser ? <Home /> : <Login /> } />
            </Routes>
        </div>
  );
}

export default App;
