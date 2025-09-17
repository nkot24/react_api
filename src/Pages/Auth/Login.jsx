import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Login failed: ' + (errorData.message || 'Unknown error'));
        return;
      }

      alert('Login successful!');
      navigate('/posts');  // Redirect to posts page

    } catch (error) {
      alert('Login error');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
