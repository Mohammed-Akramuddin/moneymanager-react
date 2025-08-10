import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';

function App() {
  const { user } = useContext(AppContext);

  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

export default App;
