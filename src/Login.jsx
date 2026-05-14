import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulating a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace this with your actual login API call when ready
      // const response = await axios.post(URLS.login, { email, password });
      // const token = response.data.token;
      // console.log(token)
      // Hardcoding the token for now as per your previous instruction
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWRkN2YwMTNiNDFjZDI3ZDRkMzMxNmUiLCJwYXNzd29yZCI6IiQyYiQxMCRHcUI2MjJadGhHWGdVc1V1WE9NMkh1Q3ZOYy42WlVNRlJybGNtUTBWcS5WLmtMbWp4NmRyQyIsImVtYWlsIjoid2hhdG5vdGJ1ZGR5QGdtYWlsLmNvbSIsImlhdCI6MTc3NzQ0MDI5MSwiZXhwIjoxODQwNTEyMjkxfQ.n8-FrzuljinhsErF_QhrdJtECnE3-zIEhaSRdqCayJw";
      
      localStorage.setItem('token', token);
      navigate('/'); // Redirect to the dashboard
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm ring-1 ring-gray-900/5">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Email address"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {error && <div className="text-center text-sm text-red-500">{error}</div>}

          <div>
            <button type="submit" disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;