import React from 'react';
import Logo from '../../../components/authComponent/Logo';
import SignupForm from '../../../components/authComponent/SignupForm';
import IllustrationSection from '../../../components/authComponent/IllustrationSection';

function SignUpPage() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full grid md:grid-cols-2 overflow-hidden">
          {/* Left Section */}
          <div className="p-8 md:p-12 flex flex-col">
            <Logo />
            <IllustrationSection />
          </div>
  
          {/* Right Section */}
          <div className="p-8 md:p-12 bg-white">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-500 mb-8">
                Start your 30-day free trial. No credit card required.
              </p>
              
              <SignupForm />
  
              <p className="mt-6 text-center text-gray-500">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default SignUpPage;