import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from './URLs/Urls';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulating a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace this with your actual login API call when ready
      const response = await axios.post(URLS.login, { email, password });
      const token = response.data.token;
      console.log(token)
      // Hardcoding the token for now as per your previous instruction
      // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWRkN2YwMTNiNDFjZDI3ZDRkMzMxNmUiLCJwYXNzd29yZCI6IiQyYiQxMCRHcUI2MjJadGhHWGdVc1V1WE9NMkh1Q3ZOYy42WlVNRlJybGNtUTBWcS5WLmtMbWp4NmRyQyIsImVtYWlsIjoid2hhdG5vdGJ1ZGR5QGdtYWlsLmNvbSIsImlhdCI6MTc3NzQ0MDI5MSwiZXhwIjoxODQwNTEyMjkxfQ.n8-FrzuljinhsErF_QhrdJtECnE3-zIEhaSRdqCayJw";
      
      localStorage.setItem('token', token);
      navigate('/'); // Redirect to the dashboard
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-2xl shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required
                className="relative block w-full appearance-none rounded-xl border-none bg-gray-800 px-4 py-3 text-white placeholder-gray-500 shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] focus:outline-none focus:ring-2 focus:ring-orange-300 sm:text-sm transition-all [&:-webkit-autofill]:[-webkit-text-fill-color:#f3f4f6] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#1f2937_inset,inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151]"
                placeholder="Email address"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
                className="relative block w-full appearance-none rounded-xl border-none bg-gray-800 px-4 py-3 pr-10 text-gray-200 placeholder-gray-500 shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm transition-all [&:-webkit-autofill]:[-webkit-text-fill-color:#f3f4f6] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#1f2937_inset,inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151]"
                placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="text-center text-sm font-bold text-red-400">{error}</div>}

          <div>
            <button type="submit" disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl border-none bg-gray-800 px-4 py-3 text-sm font-bold text-gray-300 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] hover:text-orange-400 focus:outline-none disabled:opacity-50 transition-all">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;