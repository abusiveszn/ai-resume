import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials, SignupData, AuthContextType } from '@/types/auth';
import { MOCK_USERS } from '@/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo passwords (in real app, these would be hashed)
const DEMO_PASSWORDS: Record<string, string> = {
  'admin@airesume.ai': 'admin123',
  'user@example.com': 'user123',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ai-resume-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('ai-resume-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS.find(u => u.email === credentials.email);
    const correctPassword = DEMO_PASSWORDS[credentials.email];
    
    if (mockUser && correctPassword === credentials.password) {
      const updatedUser = {
        ...mockUser,
        lastLoginAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem('ai-resume-user', JSON.stringify(updatedUser));
      toast.success(`Welcome back, ${updatedUser.name}!`);
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === data.email)) {
      toast.error('Email already registered');
      setIsLoading(false);
      throw new Error('Email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    
    // Add to mock users (in real app, this would be a database call)
    MOCK_USERS.push(newUser);
    DEMO_PASSWORDS[data.email] = data.password;
    
    setUser(newUser);
    localStorage.setItem('ai-resume-user', JSON.stringify(newUser));
    toast.success('Account created successfully!');
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ai-resume-user');
    toast.success('Logged out successfully');
  }, []);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
