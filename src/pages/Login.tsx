import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Card,
  Title,
  Text,
  Group,
  Divider,
  Box,
  Anchor,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';

import { Layout } from '../components/Layout';
import { LoginFormValues } from '../types';
import { useAuthStore } from '../store/authStore';
import { useDocumentTitle } from '../hooks/useDecumentTitle';

export const LoginPage: React.FC = () => {
  useDocumentTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const form = useForm<LoginFormValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => 
        /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
      password: (value) => 
        value.length >= 6 ? null : 'Password must be at least 6 characters',
    },
  });

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an actual API call
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // For demo purposes, any valid email/password is accepted
      const mockResponse = { 
        user: { email: values.email }, 
        token: 'mock-jwt-token' 
      };
      
      login(mockResponse.user, mockResponse.token);
      
      // Navigate to the page the user was trying to access or home
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
          <Title order={2} align="center" mb="md">Welcome Back</Title>
          <Text color="dimmed" size="sm" align="center" mb="xl">
            Enter your credentials to access your account
          </Text>
          
          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Authentication Error" 
              color="red" 
              mb="md"
            >
              {error}
            </Alert>
          )}
          
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps('email')}
            />
            
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps('password')}
            />
            
            <Group position="apart" mt="md">
              <Anchor<'a'> 
                onClick={(event) => event.preventDefault()}
                href="#" 
                size="sm"
              >
                Forgot password?
              </Anchor>
            </Group>
            
            <Button 
              type="submit" 
              fullWidth 
              mt="xl"
              loading={loading}
            >
              Sign in
            </Button>
          </form>
          
          <Divider my="md" labelPosition="center" label="Demo credentials" />
          
          <Text size="xs" align="center" mt="sm">
            Use any valid email format and password (min 6 chars)
          </Text>
        </Card>
      </Box>
    </Layout>
  );
};
