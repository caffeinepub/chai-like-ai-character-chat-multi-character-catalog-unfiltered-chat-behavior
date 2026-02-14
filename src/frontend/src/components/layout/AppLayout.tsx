import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LoginButton from '../auth/LoginButton';
import { Film, MessageSquare, User } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/app-logo.dim_512x512.png" alt="Logo" className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tight">CineChat</span>
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/character"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${
                    currentPath === '/character' ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Character
                </Link>
                <Link
                  to="/chats"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${
                    currentPath.startsWith('/chat') ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chats
                </Link>
              </>
            )}
            <LoginButton />
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026. Built with <Film className="inline h-4 w-4 mx-1" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
