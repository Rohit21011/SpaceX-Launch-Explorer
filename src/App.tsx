import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { ErrorBoundary } from "./components/errorBoundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { ProtectedRoute } from "./components/protectedRoutes";
import { LaunchesListPage } from "./pages/LaunchesListPage";
import { LaunchDetailPage } from "./pages/LaunchDetailPage";
import { NotFoundPage } from "./pages/NotFound.tsx";


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function App() {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('light');
  
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    localStorage.setItem('theme', nextColorScheme);
  };

  // Initialize color scheme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ColorScheme | null;
    if (savedTheme) {
      setColorScheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setColorScheme('dark');
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider 
          colorScheme={colorScheme} 
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{
              colorScheme,
              primaryColor: 'blue',
              defaultRadius: 'md',
              fontFamily: 'Inter, sans-serif',
              headings: { fontFamily: 'Inter, sans-serif' },
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/launches"
                  element={
                    <ProtectedRoute>
                      <LaunchesListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/launch/:id"
                  element={
                    <ProtectedRoute>
                      <LaunchDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/launches" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </MantineProvider>
        </ColorSchemeProvider>
     
      </QueryClientProvider>
    </ErrorBoundary>
  );
};