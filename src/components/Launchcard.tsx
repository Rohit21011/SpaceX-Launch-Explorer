import React from 'react';
import { Card, Group, Text, Badge, Button, Image, Stack } from '@mantine/core';
import { Launch } from '../types';

import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/helper';

interface LaunchCardProps {
  launch: Launch;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/launch/${launch.id}`);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {launch.links.patch.small ? (
          <Image
            src={launch.links.patch.small}
            height={160}
            alt={launch.name}
            withPlaceholder
          />
        ) : (
          <div 
            style={{ 
              height: 160, 
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text color="dimmed">No mission patch</Text>
          </div>
        )}
      </Card.Section>

      <Stack mt="md" spacing="xs">
        <Group position="apart">
          <Text weight={500}>{launch.name}</Text>
          <Badge 
            color={launch.success ? 'green' : launch.success === false ? 'red' : 'gray'}
          >
            {launch.success ? 'Success' : launch.success === false ? 'Failed' : 'Unknown'}
          </Badge>
        </Group>
        
        <Text size="sm" color="dimmed">
          Date: {formatDate(launch.date_utc)}
        </Text>
        
        <Text size="sm" color="dimmed">
          Flight #{launch.flight_number}
        </Text>
        
        <Text size="sm" lineClamp={2}>
          {launch.details || 'No details available'}
        </Text>
      </Stack>

      <Button 
        variant="light" 
        color="blue" 
        fullWidth 
        mt="md" 
        radius="md"
        onClick={handleViewDetails}
      >
        View Details
      </Button>
    </Card>
  );
};
