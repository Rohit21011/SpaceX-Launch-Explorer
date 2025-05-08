import React from 'react';
import { Pagination, Text, Group } from '@mantine/core';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalDocs: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  pageSize,
  totalPages,
  totalDocs,
  onPageChange,
}) => {
  return (
    <Group position="apart" mt="xl">
      <Text size="sm" color="dimmed">
        Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalDocs)} of {totalDocs} launches
      </Text>
      <Pagination
        total={totalPages}
        value={page}
        onChange={onPageChange}
        withEdges
        radius="md"
        styles={{
          control: {
            transition: 'transform 0.15s ease',
            '&[data-active]': {
              transform: 'scale(1.05)',
            },
          },
        }}
      />
    </Group>
  );
};