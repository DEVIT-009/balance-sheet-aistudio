import React, { useState } from 'react';
import { LockKeyhole, UserRound } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = onLogin(username.trim(), password);

    if (!success) {
      setError('Invalid username or password.');
      return;
    }

    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-brand">
          <span className="login-kicker">Secure Access</span>
          <h1>B_NIN Financial Tracker</h1>
          <p>Sign in with the credentials defined in your environment file.</p>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <h2>Login</h2>
            <p>Fill Username and Password to login.</p>
          </div>

          <label className="login-field">
            <span>Username</span>
            <div className="login-input">
              <UserRound size={18} />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-input">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
