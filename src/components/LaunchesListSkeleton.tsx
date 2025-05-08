import React from 'react';
import {
  Box,
  Group,
  Card,
  Skeleton,
  useMantineTheme,
  Container,
} from '@mantine/core';
import { DataTable } from './DataTable';
import { LaunchesListSkeletonProps } from '../types';


export const LaunchesListSkeleton: React.FC<LaunchesListSkeletonProps> = ({ viewMode }) => {
  const theme = useMantineTheme();

  const renderGridViewSkeleton = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: theme.spacing.md,
        [theme.fn.smallerThan('sm')]: {
          gridTemplateColumns: '1fr',
          gap: theme.spacing.sm,
        },
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} shadow="sm" p="md" radius="md" withBorder>
          <Skeleton height={150} width="100%" mb="sm" />
          <Group spacing="xs" mb="sm">
            <Skeleton height={24} width={120} />
            <Skeleton height={24} width={60} />
          </Group>
          <Skeleton height={16} width="80%" mb="xs" />
          <Skeleton height={16} width="60%" />
        </Card>
      ))}
    </div>
  );

  return (
    <Container
      size="xl"
      px="xs"
      sx={{
        [theme.fn.smallerThan('sm')]: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      }}
    >
      <Box mb="xl" pos="relative" aria-hidden="true">
        <Group
          position="apart"
          mb="lg"
          sx={{
            transition: 'opacity 0.5s',
            [theme.fn.smallerThan('sm')]: {
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: theme.spacing.md,
            },
          }}
        >
          <Group>
            <Skeleton height={32} circle />
            <Skeleton height={28} width={200} />
          </Group>
          <Skeleton
            height={36}
            width={300}
            sx={{ [theme.fn.smallerThan('sm')]: { width: '100%' } }}
          />
        </Group>

        <Card
          shadow="sm"
          p="md"
          radius="md"
          mb="lg"
          withBorder
          sx={{ [theme.fn.smallerThan('sm')]: { padding: theme.spacing.xs } }}
        >
          <Group
            position="apart"
            sx={{
              [theme.fn.smallerThan('sm')]: {
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: theme.spacing.sm,
              },
            }}
          >
            <Group spacing="xs">
              <Skeleton height={32} width={60} radius="lg" />
              <Skeleton height={32} width={80} radius="lg" />
              <Skeleton height={32} width={60} radius="lg" />
            </Group>
            <Group spacing="xs">
              <Skeleton height={32} circle />
              <Skeleton height={32} circle />
              <Group spacing={4}>
                <Skeleton height={32} circle />
                <Skeleton height={32} circle />
              </Group>
            </Group>
          </Group>
        </Card>

        <Group
          spacing="xs"
          mb="md"
          sx={{
            flexWrap: 'wrap',
            [theme.fn.smallerThan('sm')]: {
              justifyContent: 'center',
            },
          }}
        >
          <Skeleton height={20} width={80} />
          <Skeleton height={32} width={120} radius="lg" />
          <Skeleton height={24} width={100} radius="lg" />
          <Skeleton height={24} width={120} radius="lg" />
          <Skeleton height={20} width={60} />
        </Group>

        {viewMode === 'list' ? (
          <DataTable
            data={[]}
            sortState={{ field: null, order: null }}
            onSortChange={() => {}}
            onRowClick={() => {}}
            isLoading={true}
          />
        ) : (
          renderGridViewSkeleton()
        )}

        <Group
          position="apart"
          mt="lg"
          sx={{
            [theme.fn.smallerThan('sm')]: {
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing.sm,
            },
          }}
        >
          <Skeleton height={16} width={150} />
          <Group spacing={4}>
            <Skeleton height={32} width={32} radius="md" />
            <Skeleton height={32} width={32} radius="md" />
            <Skeleton height={32} width={32} radius="md" />
            <Skeleton height={32} width={32} radius="md" />
          </Group>
        </Group>
      </Box>
    </Container>
  );
};