import React from 'react';
import { 
  Box, 
  Button, 
  Group, 
  Stack, 
  Text, 
  Title 
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconHome } from '@tabler/icons-react';
import { Layout } from '../components/Layout';
import { useDocumentTitle } from '../hooks/useDecumentTitle';


export const NotFoundPage: React.FC = () => {
  useDocumentTitle('Page Not Found');
  const navigate = useNavigate();

  return (
    <Layout>
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 120px)',
          textAlign: 'center',
        }}
      >
        <Stack spacing="md">
          <Title size={100}>404</Title>
          <Title order={2}>Page Not Found</Title>
          <Text color="dimmed" size="lg">
            The page you are looking for doesn't exist or has been moved.
          </Text>
          <Group position="center" mt="xl">
            <Button 
              leftIcon={<IconHome size={16} />}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Group>
        </Stack>
      </Box>
    </Layout>
  );
};
