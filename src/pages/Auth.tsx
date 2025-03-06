
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen bg-interview-slate-light">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
