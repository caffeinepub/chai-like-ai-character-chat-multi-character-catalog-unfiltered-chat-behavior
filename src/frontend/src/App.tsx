import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import CharacterPage from './pages/CharacterPage';
import ChatsPage from './pages/ChatsPage';
import ChatSessionPage from './pages/ChatSessionPage';
import MovieModePage from './pages/MovieModePage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

// Root route component (must start with uppercase)
function RootComponent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <AppLayout>
      <Outlet />
      {isAuthenticated && <ProfileSetupModal />}
    </AppLayout>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Landing page (public)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// Character page (authenticated)
const characterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character',
  component: CharacterPage,
});

// Chats list page (authenticated)
const chatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chats',
  component: ChatsPage,
});

// Chat session page (authenticated)
const chatSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$sessionId',
  component: ChatSessionPage,
});

// Movie mode page (authenticated)
const movieModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movie/$sessionId',
  component: MovieModePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  characterRoute,
  chatsRoute,
  chatSessionRoute,
  movieModeRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
