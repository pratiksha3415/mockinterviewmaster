import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BlurContainer from '@/components/ui/BlurContainer';
import api from '@/services/api';

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
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check if the backend is available
      const backendAvailable = await checkBackendAvailability();
      
      if (!backendAvailable) {
        // If backend is not available, fall back to localStorage method
        handleLocalAuthentication();
        return;
      }
      
      if (formType === 'register') {
        await api.auth.register(formState.name, formState.email, formState.password);
        toast.success('Account created successfully!');
        
        // Auto login after registration
        const loginData = await api.auth.login(formState.email, formState.password);
        
        // Save user data
        const userData = {
          id: loginData.user_id || Date.now().toString(),
          name: formState.name,
          email: formState.email,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
      } else { // Login
        const loginData = await api.auth.login(formState.email, formState.password);
        
        // We should get user data from backend, but for now use what we have
        const userData = {
          id: loginData.user_id || Date.now().toString(),
          name: '', // We might want to fetch this from a user endpoint
          email: formState.email,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Logged in successfully!');
      }
      
      setLoading(false);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'An unexpected error occurred');
      setLoading(false);
      
      // If there was an API error, fall back to localStorage method
      if (error.message.includes('Failed to fetch')) {
        handleLocalAuthentication();
      }
    }
  };
  
  // Check if the backend is available
  const checkBackendAvailability = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend not available, falling back to localStorage authentication');
      return false;
    }
  };
  
  // Fallback to localStorage authentication if backend is not available
  const handleLocalAuthentication = () => {
    try {
      if (formType === 'register') {
        // Check if email already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = existingUsers.some((user: any) => user.email === formState.email);
        
        if (userExists) {
          setError('An account with this email already exists');
          setLoading(false);
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name: formState.name,
          email: formState.email,
          password: formState.password, // In a real app, this would be hashed
        };
        
        // Add to users list
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Set current user (without password)
        const { password, ...userWithoutPassword } = newUser;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        // Create empty interview history for this user
        localStorage.setItem(`interview_history_${newUser.id}`, JSON.stringify([]));
        
        toast.success('Account created successfully! (Using local storage)');
        
      } else { // Login
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(
          (u: any) => u.email === formState.email && u.password === formState.password
        );
        
        if (!user) {
          setError('Invalid email or password');
          setLoading(false);
          return;
        }
        
        // Set current user (without password)
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        toast.success('Logged in successfully! (Using local storage)');
      }
      
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Local authentication error:', error);
      setError('An unexpected error occurred');
      setLoading(false);
    }
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
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
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
