import React from 'react';
import { Paper, Box, Text, Title, Button } from '@mantine/core';
import { IconSearch, IconRefresh } from '@tabler/icons-react';

interface EmptyStateProps {
  search: string;
  successFilter: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ search, successFilter, onReset }) => {
  return (
    <Paper p="xl" withBorder shadow="md" radius="md">
      <Box ta="center" py="xl">
        <IconSearch size={48} color="gray.5" />
        <Title order={3} mt="md">
          No launches found
        </Title>
        <Text color="dimmed" mt="xs">
          No launches found{search ? ` matching "${search}"` : ''}
          {successFilter !== 'all' ? ` with status "${successFilter}"` : ''}
        </Text>
        <Button
          mt="xl"
          variant="light"
          leftIcon={<IconRefresh size={16} />}
          onClick={onReset}
          aria-label="Reset filters"
        >
          Reset Filters
        </Button>
      </Box>
    </Paper>
  );
};