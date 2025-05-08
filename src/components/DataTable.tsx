import React from 'react';
import {
  Table,
  ScrollArea,
  Paper,
  Group,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Menu,
  Skeleton,
  useMantineTheme,
  Avatar,
} from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconRocket, IconCalendar, IconChevronRight, IconBookmark, IconShare, IconDots, IconCheck, IconX } from '@tabler/icons-react';
import { DataTableProps, Launch, SortState } from '../types';



export const DataTable: React.FC<DataTableProps> = ({ data, sortState, onSortChange, onRowClick, isLoading }) => {
  const theme = useMantineTheme();

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

  const renderSortIcon = (field: string) => {
    if (sortState.field !== field || !sortState.order) return null;
    return sortState.order === 'asc' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />;
  };

  return (
    <Paper
      shadow="sm"
      p="sm"
      withBorder
      radius="md"
      sx={{
        overflowX: 'auto',
        [theme.fn.smallerThan('sm')]: {
          padding: theme.spacing.xs,
        },
      }}
    >
      <ScrollArea>
        <Table
          highlightOnHover
          verticalSpacing="xs"
          horizontalSpacing="md"
          fontSize="sm"
          sx={{
            minWidth: 600,
            [theme.fn.smallerThan('sm')]: {
              fontSize: theme.fontSizes.xs,
              minWidth: 400,
            },
          }}
        >
          <thead
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              zIndex: 1,
            }}
          >
            <tr>
              <th style={{ width: '35%' }}>
                <Group
                  spacing={4}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSortChange('name')}
                  aria-label="Sort by mission name"
                >
                  <Text weight={600}>Mission</Text>
                  {renderSortIcon('name')}
                </Group>
              </th>
              <th style={{ width: '20%' }}>
                <Group
                  spacing={4}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSortChange('flight_number')}
                  aria-label="Sort by flight number"
                >
                  <Text weight={600}>Flight #</Text>
                  {renderSortIcon('flight_number')}
                </Group>
              </th>
              <th style={{ width: '25%' }}>
                <Group
                  spacing={4}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSortChange('date_utc')}
                  aria-label="Sort by launch date"
                >
                  <Text weight={600}>Date</Text>
                  {renderSortIcon('date_utc')}
                </Group>
              </th>
              <th style={{ width: '20%' }}>
                <Text weight={600}>Status</Text>
              </th>
              <th
                style={{
                  width: '20%',
                  display: theme.fn.smallerThan('sm') ? 'none' : 'table-cell',
                }}
              >
                <Text weight={600}>Actions</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Group spacing="xs">
                      <Skeleton height={32} circle />
                      <Skeleton height={16} width="80%" />
                    </Group>
                  </td>
                  <td>
                    <Skeleton height={16} width="50%" />
                  </td>
                  <td>
                    <Skeleton height={16} width="70%" />
                  </td>
                  <td>
                    <Skeleton height={16} width="50%" />
                  </td>
                  <td style={{ display: theme.fn.smallerThan('sm') ? 'none' : 'table-cell' }}>
                    <Skeleton height={16} width="50%" />
                  </td>
                </tr>
              ))
            ) : (
              data.map((launch) => (
                <tr
                  key={launch.id}
                  onClick={() => onRowClick(launch.id)}
                  style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onRowClick(launch.id)}
                  aria-label={`View details for ${launch.name || 'launch'}`}
                >
                  <td>
                    <Group spacing="xs">
                      <Avatar size="sm" color="blue" radius="md">
                        <IconRocket size={16} />
                      </Avatar>
                      <div>
                        <Text weight={500} size="sm" lineClamp={1}>
                          {launch.name || 'N/A'}
                        </Text>
                        <Text
                          size="xs"
                          color="dimmed"
                          lineClamp={1}
                          sx={{ [theme.fn.smallerThan('sm')]: { maxWidth: 120 } }}
                        >
                          {launch.details ? launch.details.substring(0, 30) + '...' : 'No details'}
                        </Text>
                      </div>
                    </Group>
                  </td>
                  <td>
                    <Badge variant="outline" size="xs">
                      #{launch.flight_number || 'N/A'}
                    </Badge>
                  </td>
                  <td>
                    <Group spacing={4}>
                      <IconCalendar size={12} />
                      <Text size="xs">{launch.date_utc ? formatDate(launch.date_utc) : 'N/A'}</Text>
                    </Group>
                  </td>
                  <td>{getSuccessBadge(launch.success)}</td>
                  <td style={{ display: theme.fn.smallerThan('sm') ? 'none' : 'table-cell' }}>
                    <Group spacing={4}>
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="md"
                          aria-label="View launch details"
                        >
                          <IconChevronRight size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Menu withinPortal position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon size="md" aria-label="More actions">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item icon={<IconBookmark size={14} />}>Bookmark</Menu.Item>
                          <Menu.Item icon={<IconShare size={14} />}>Share</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};