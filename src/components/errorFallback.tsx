import React from 'react';
import { Card, Title, Text, Button, Stack } from '@mantine/core';
import { ApiError } from '../types';

interface ErrorFallbackProps {
  error: ApiError;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack spacing="md">
        <Title order={3}>Something went wrong</Title>
        <Text color="red">
          {error.message || 'An unknown error occurred'}
          {error.status && ` (Status: ${error.status})`}
        </Text>
        <Button onClick={resetError}>Try again</Button>
      </Stack>
    </Card>
  );
};