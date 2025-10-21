import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AdminUser } from './lib/supabase';

function App() {
  const [user, setUser] = useState<AdminUser | null>(null);

  const handleLogin = (loggedInUser: AdminUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
