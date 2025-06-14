
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'examiner' | 'student';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'examiner' | 'student') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('proctme_user');
    const token = localStorage.getItem('proctme_token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('proctme_user');
        localStorage.removeItem('proctme_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'examiner' | 'student'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check registered users first
      const registeredUsers = JSON.parse(localStorage.getItem('proctme_users') || '[]');
      const registeredUser = registeredUsers.find((user: any) => 
        user.email === email && user.password === password && user.role === role
      );

      if (registeredUser) {
        const userData: User = {
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
          role: registeredUser.role,
          createdAt: registeredUser.createdAt
        };

        const token = `jwt_token_${Date.now()}_${Math.random()}`;
        
        localStorage.setItem('proctme_user', JSON.stringify(userData));
        localStorage.setItem('proctme_token', token);
        setUser(userData);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.name}!`,
        });

        return true;
      }

      // Fallback to demo credentials for backward compatibility
      const validCredentials = {
        examiner: { email: 'examiner@proctme.com', password: 'examiner123' },
        student: { email: 'student@proctme.com', password: 'student123' }
      };

      const isValid = 
        email === validCredentials[role].email && 
        password === validCredentials[role].password;

      if (isValid) {
        const userData: User = {
          id: `${role}_${Date.now()}`,
          email,
          name: role === 'examiner' ? 'Dr. John Examiner' : 'Alex Student',
          role,
          createdAt: new Date().toISOString()
        };

        const token = `jwt_token_${Date.now()}_${Math.random()}`;
        
        localStorage.setItem('proctme_user', JSON.stringify(userData));
        localStorage.setItem('proctme_token', token);
        setUser(userData);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.name}!`,
        });

        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email, password, or role",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('proctme_user');
    localStorage.removeItem('proctme_token');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
