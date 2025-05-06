import React, { ReactNode } from 'react';
import { 
  AppShell, 
  Header, 
  Group, 
  Title, 
  Button, 
  Loader,
  Container,
  useMantineTheme
} from '@mantine/core';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: ReactNode;
  loading?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, loading = false }) => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs" style={{ 
          backgroundColor: theme.colors.blue[7]
        }}>
          <Container size="xl">
            <Group position="apart">
              <Title 
                order={3} 
                style={{ color: 'white', cursor: 'pointer' }}
                onClick={handleLogoClick}
              >
                SpaceX Launch Explorer
              </Title>
              {isAuthenticated && (
                <Button 
                  variant="white" 
                  color="dark"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </Group>
          </Container>
        </Header>
      }
      styles={(theme) => ({
        main: { 
          backgroundColor: theme.colorScheme === 'dark' 
            ? theme.colors.dark[8] 
            : theme.colors.gray[0] 
        },
      })}
    >
      <Container size="xl">
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: 'calc(100vh - 120px)' 
          }}>
            <Loader size="xl" />
          </div>
        ) : (
          children
        )}
      </Container>
    </AppShell>
  );
};
