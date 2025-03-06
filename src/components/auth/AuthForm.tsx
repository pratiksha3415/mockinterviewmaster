
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BlurContainer from '@/components/ui/BlurContainer';

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultType = searchParams.get('type') === 'register' ? 'register' : 'login';
  const [formType, setFormType] = useState<'login' | 'register'>(defaultType);
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock successful auth
      if (formType === 'register') {
        localStorage.setItem('user', JSON.stringify({
          name: formState.name,
          email: formState.email,
          id: Date.now().toString(),
        }));
        
        toast.success('Account created successfully!');
      } else {
        localStorage.setItem('user', JSON.stringify({
          name: 'User',
          email: formState.email,
          id: Date.now().toString(),
        }));
        
        toast.success('Logged in successfully!');
      }
      
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <BlurContainer className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {formType === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-gray-600">
            {formType === 'login' 
              ? 'Sign in to continue your interview practice' 
              : 'Sign up to start mastering your interview skills'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formType === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formState.name}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 bg-interview-blue hover:bg-interview-blue-dark text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                {formType === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              <>{formType === 'login' ? 'Sign In' : 'Create Account'}</>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {formType === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}
              className="ml-1 text-interview-blue hover:underline focus:outline-none"
            >
              {formType === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </BlurContainer>
    </motion.div>
  );
};

export default AuthForm;
