import { useState } from "react";
import SignUpForm from "../components/signup-form";
import LoginInForm from "../components/login-form";

export default function Authentication() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 dark:bg-gray-800 items-center justify-center">
        <div className="text-center">
          <img src="/path/to/billify-logo.png" alt="Billify Logo" className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to Billify</h1>
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">Your ultimate billing solution</p>
        </div>
      </div>
      <div className="flex flex-col justify-center h-full w-full lg:w-1/2 p-8">
        {isSignUp ? (
          <SignUpForm setIsSignUp={setIsSignUp} />
        ) : (
          <LoginInForm setIsSignUp={setIsSignUp} />
        )}
      </div>
    </div>
  );
}