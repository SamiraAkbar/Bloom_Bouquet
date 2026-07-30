import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
       // mock behavior
       if(!email || !password || !name) setError("All fields required");
       else {
           login('mock-token-user', { id: 'user1', name, email, role: 'user' });
           navigate('/dashboard');
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 border border-brand-100">
        <div>
          <h2 className="text-center text-3xl font-serif italic text-gray-900">Create Account</h2>
          <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-gray-500">
             Join Bloom & Bouquet
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <div className="space-y-4">
             <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Full Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Email address</label>
              <input
                type="email" required
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Password</label>
              <input
                type="password" required
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 border border-brand-600 text-[10px] uppercase font-bold tracking-widest text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          
          <p className="text-center justify-center text-[10px] uppercase tracking-widest text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-bold hover:text-brand-400 border-b border-brand-600 pb-0.5">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
