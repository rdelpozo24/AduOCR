
import React, { useState } from 'react';

interface MfaLoginProps {
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

const MfaLogin: React.FC<MfaLoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'login' | 'mfa' | 'loading'>('login');
  const [email, setEmail] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const handleInitialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep('loading');
      setTimeout(() => setStep('mfa'), 1000);
    }
  };

  const handleMfaVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length === 6) {
      setStep('loading');
      setTimeout(() => {
        onLoginSuccess({
          name: email.split('@')[0].toUpperCase(),
          email: email,
        });
      }, 1000);
    }
  };

  const handleBypass = () => {
    setStep('loading');
    setTimeout(() => {
      onLoginSuccess({
        name: 'ADMIN USER',
        email: 'admin@documind.pro',
      });
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 'login' ? 'Microsoft Sign-in' : step === 'mfa' ? 'Verify Identity' : 'Authenticating...'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'login' && 'Use your corporate account to access DocuMind'}
            {step === 'mfa' && 'We sent a 6-digit code to your Authenticator app'}
          </p>
        </div>

        {step === 'loading' && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {step === 'login' && (
          <form className="mt-8 space-y-6" onSubmit={handleInitialLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="someone@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Sign in
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold tracking-widest">Development</span></div>
              </div>

              <button
                type="button"
                onClick={handleBypass}
                className="w-full py-3 px-4 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center gap-2 transition-all border-dashed"
              >
                <i className="fas fa-terminal opacity-50"></i>
                Bypass MFA (No configuration)
              </button>
            </div>
          </form>
        )}

        {step === 'mfa' && (
          <form className="mt-8 space-y-6" onSubmit={handleMfaVerify}>
            <div>
              <input
                type="text"
                maxLength={6}
                required
                className="appearance-auto block w-full px-3 py-4 border border-gray-300 text-center text-2xl tracking-[1em] font-bold rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="text-center text-xs text-gray-500">
              Check your Microsoft Authenticator app for the verification code.
            </div>

            <button
              type="submit"
              disabled={mfaCode.length !== 6}
              className="disabled:opacity-50 w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all"
            >
              Verify & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MfaLogin;
