import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    initials: string;
  } | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true';
  
  const [user] = useState({
    name: authEnabled ? 'User' : 'Guest User',
    email: authEnabled ? 'user@example.com' : 'guest@example.com',
    initials: authEnabled ? 'U' : 'GU'
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !authEnabled,
        user,
        login: () => {},
        logout: () => {}
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
