import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, Title, Text, Button, Stack } from '@mantine/core';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by error boundary:', error, errorInfo);
    // In production, you would send this to an error monitoring service
    // like Sentry, LogRocket, etc.
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 600, margin: 'auto', marginTop: 100 }}>
          <Stack>
            <Title order={2}>Something went wrong</Title>
            <Text color="red">{this.state.error?.message || 'An unexpected error occurred'}</Text>
            <Button onClick={() => window.location.reload()}>
              Refresh the page
            </Button>
          </Stack>
        </Card>
      );
    }

    return this.props.children;
  }
}
