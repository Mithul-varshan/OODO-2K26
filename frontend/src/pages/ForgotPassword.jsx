import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Email is invalid';
    }
    return '';
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setErrors('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors(emailError);
      return;
    }

    setIsLoading(true);
    setErrors('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        // For demo purposes, show the reset token
        if (data.data && data.data.resetToken) {
          setResetToken(data.data.resetToken);
        }
      } else {
        setErrors(data.message || 'Failed to process request. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors('Unable to connect to server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Standalone Branding - No Navigation */}
      <div className="pt-8 pb-6">
        <div className="flex justify-center">
          <span className="text-3xl font-bold text-white tracking-tight">
            Global<span className="text-blue-500">Trotter</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Forgot Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Enter your email to receive a password reset link
            </p>
          </div>

          <form className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg border border-gray-700" onSubmit={handleSubmit}>
            {errors && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{errors}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            {resetToken && (
              <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-3 rounded relative text-sm">
                <p className="font-semibold mb-2">Demo Mode - Reset Token:</p>
                <p className="break-all mb-2 font-mono text-xs bg-yellow-950 p-2 rounded">{resetToken}</p>
                <Link 
                  to={`/reset-password?token=${resetToken}`}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Click here to reset your password →
                </Link>
              </div>
            )}

            {!successMessage && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full px-3 py-2 bg-gray-700 border ${
                      errors ? 'border-red-500' : 'border-gray-600'
                    } placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      isLoading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="text-center">
              <Link to="/" className="font-medium text-sm text-blue-400 hover:text-blue-300">
                ← Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
