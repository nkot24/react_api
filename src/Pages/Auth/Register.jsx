import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const res = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errors) {
          alert(Object.values(errorData.errors).flat().join('\n'));
        } else {
          alert('Registration failed: ' + (errorData.message || 'Unknown error'));
        }
        return;
      }

      alert('Registration successful!');
      navigate('/posts');  // Redirect to posts page

    } catch (error) {
      alert('Registration error');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" value={name} required onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" value={passwordConfirmation} required onChange={e => setPasswordConfirmation(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
