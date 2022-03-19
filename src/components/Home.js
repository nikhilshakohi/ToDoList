/*React*/
import { useNavigate } from 'react-router-dom';
/*Pages*/
import Header from './Header';
import {useAuth} from '../auth/AuthContext';

const Home = () => {

    const { logout } = useAuth();
    const currentUser = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <div>Hello There {currentUser.currentUser.displayName}!</div>
            <input type="button" value="Logout" onClick={() => { logout(); navigate('/Login'); } } />
        </div>
    );
}

export default Home;