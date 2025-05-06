import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Group,
  Text,
  Title,
  Badge,
  Image,
  Grid,
  List,
  Button,
  Skeleton,
  Box,
  Divider,
} from '@mantine/core';
import { IconArrowLeft, IconRocket } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useDocumentTitle } from '@mantine/hooks';
import { spacexApi } from '../api/spacex-api';
import { ErrorFallback } from '../components/errorFallback';
import { Layout } from '../components/Layout';
import { Launch, Rocket } from '../types';
import { formatDate } from '../utils/helper';


export const LaunchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/launches');
    return null;
  }

  const { 
    data: launch, 
    isLoading: launchLoading, 
    isError: launchError,
    error: launchErrorData,
    refetch: refetchLaunch
  } = useQuery<Launch, any>({
    queryKey: ['launch', id],
    queryFn: () => spacexApi.getLaunch(id),
  });

  const { 
    data: rocket, 
    isLoading: rocketLoading,
    isError: rocketError,
    error: rocketErrorData,
    refetch: refetchRocket
  } = useQuery<Rocket, any>({
    queryKey: ['rocket', launch?.rocket],
    queryFn: () => spacexApi.getRocket(launch!.rocket),
    enabled: !!launch?.rocket,
  });

  useDocumentTitle(launch?.name || 'Launch Details');

  const handleBack = () => {
    navigate('/launches');
  };

  const handleRefetchAll = () => {
    refetchLaunch();
    if (launch?.rocket) {
      refetchRocket();
    }
  };

  if (launchError) {
    return (
      <Layout>
        <ErrorFallback 
          error={launchErrorData} 
          resetError={refetchLaunch} 
        />
      </Layout>
    );
  }

  if (rocketError && launch?.rocket) {
    return (
      <Layout>
        <ErrorFallback 
          error={rocketErrorData} 
          resetError={refetchRocket} 
        />
      </Layout>
    );
  }

  const isLoading = launchLoading || (!!launch?.rocket && rocketLoading);

  return (
    <Layout loading={isLoading && !launch}>
      <Button
        leftIcon={<IconArrowLeft size={16} />}
        variant="subtle"
        onClick={handleBack}
        mb="md"
      >
        Back to launches
      </Button>

      {launch && (
        <>
          <Title order={2} mb="md">
            {launch.name}
          </Title>

          <Grid gutter="md">
            <Grid.Col md={8}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group position="apart" mb="md">
                  <Skeleton visible={launchLoading} width={200}>
                    <Text weight={500} size="lg">Mission Information</Text>
                  </Skeleton>
                  <Skeleton visible={launchLoading} width={80}>
                    <Badge 
                      color={launch.success ? 'green' : launch.success === false ? 'red' : 'gray'}
                      size="lg"
                    >
                      {launch.success ? 'Success' : launch.success === false ? 'Failed' : 'Unknown'}
                    </Badge>
                  </Skeleton>
                </Group>

                <Skeleton visible={launchLoading}>
                  <List spacing="xs">
                    <List.Item>
                      <Text>
                        <b>Flight Number:</b> {launch.flight_number}
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text>
                        <b>Launch Date:</b> {formatDate(launch.date_utc)}
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text>
                        <b>Rocket:</b> {rocket?.name || 'Loading...'}
                      </Text>
                    </List.Item>
                  </List>
                </Skeleton>

                <Divider my="md" />

                <Skeleton visible={launchLoading}>
                  <Text weight={500} mb="xs">Details:</Text>
                  <Text>
                    {launch.details || 'No details available for this mission.'}
                  </Text>
                </Skeleton>
              </Card>
            </Grid.Col>

            <Grid.Col md={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                {launch.links.patch.small ? (
                  <Image
                    src={launch.links.patch.small}
                    alt={`${launch.name} mission patch`}
                    height={200}
                    fit="contain"
                  />
                ) : (
                  <Box 
                    sx={(theme) => ({
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.colors.gray[1],
                      borderRadius: theme.radius.md,
                    })}
                  >
                    <IconRocket size={64} opacity={0.5} />
                  </Box>
                )}

                <Text align="center" size="sm" color="dimmed" mt="md">
                  Mission Patch
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {rocket && (
            <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
              <Title order={3} mb="md">
                Rocket Details: {rocket.name}
              </Title>

              <Skeleton visible={rocketLoading}>
                <Grid>
                  <Grid.Col md={6}>
                    <List spacing="md">
                      <List.Item>
                        <Text><b>Type:</b> {rocket.type}</Text>
                      </List.Item>
                      <List.Item>
                        <Text><b>First Flight:</b> {formatDate(rocket.first_flight)}</Text>
                      </List.Item>
                      <List.Item>
                        <Text><b>Success Rate:</b> {rocket.success_rate_pct}%</Text>
                      </List.Item>
                    </List>
                  </Grid.Col>
                  <Grid.Col md={6}>
                    <Text weight={500} mb="xs">Description:</Text>
                    <Text size="sm">{rocket.description}</Text>
                  </Grid.Col>
                </Grid>
              </Skeleton>
            </Card>
          )}
        </>
      )}
    </Layout>
  );
};