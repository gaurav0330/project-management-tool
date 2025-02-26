import React from 'react';
import Logo from '../../../components/authComponent/Logo';
import LoginForm from '../../../components/authComponent/LoginForm';
import LoginIllustration from '../../../components/authComponent/LoginIllustration';

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <div className="p-8 md:p-12">
          <Logo />
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 mb-8">
              Please enter your details to sign in
            </p>
            
            <LoginForm />

            <p className="mt-6 text-center text-gray-500">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block bg-gray-50">
          <LoginIllustration />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;