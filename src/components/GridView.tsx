import React from 'react';
import { Grid, Card, Image, Text, Group, Badge, ActionIcon, Skeleton, useMantineTheme } from '@mantine/core';
import { IconCalendar, IconBookmark, IconShare, IconCheck, IconX } from '@tabler/icons-react';
import { Launch } from '../types';
import { LaunchCard } from './Launchcard';


interface GridViewProps {
  data: Launch[];
  onRowClick: (id: string) => void;
  isLoading: boolean;
}

export const GridView: React.FC<GridViewProps> = ({ data, onRowClick, isLoading }) => {
  const theme = useMantineTheme();

  const getRandomImageUrl = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `/api/placeholder/${400 + (hash % 200)}/${300 + (hash % 100)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getSuccessBadge = (success: boolean | null) => {
    if (success === null) return <Badge color="gray">Unknown</Badge>;
    return success ? (
      <Badge color="teal" leftSection={<IconCheck size={14} />}>
        Successful
      </Badge>
    ) : (
      <Badge color="red" leftSection={<IconX size={14} />}>
        Failed
      </Badge>
    );
  };

  return (
    <Grid gutter="md">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Grid.Col xs={12} sm={6} md={6} lg={4} key={index}>
            <Card shadow="sm" p="lg" radius="md" withBorder style={{ height: '100%' }}>
              <Skeleton height={160} />
              <Skeleton height={20} width="70%" mt="md" />
              <Group position="apart" mt="xs">
                <Skeleton height={20} width="30%" />
                <Skeleton height={20} width="20%" />
              </Group>
              <Skeleton height={40} mt="md" />
              <Group position="apart" mt="md">
                <Skeleton height={20} width="50%" />
                <Skeleton height={20} width="20%" />
              </Group>
            </Card>
          </Grid.Col>
        ))
      ) : (
        data.map((launch) => (
          <Grid.Col xs={12} sm={6} md={6} lg={4} key={launch.id}>
       <LaunchCard launch={launch}/>
          </Grid.Col>
        ))
      )}
    </Grid>
  );
};