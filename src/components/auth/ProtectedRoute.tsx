
import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute = ({
  redirectPath = '/auth',
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Wait a short moment to ensure auth state is properly initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // While loading or before initialization, show loading spinner
  if (loading || !isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-snrt-red" />
      </div>
    );
  }

  // After loading is complete and not authenticated, redirect to auth page
  if (!user) {
    console.log('User not authenticated, redirecting to', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // User is authenticated
  console.log('User authenticated, rendering protected content');
  return <Outlet />;
};
