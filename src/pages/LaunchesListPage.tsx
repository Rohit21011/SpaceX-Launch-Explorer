import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Group,
  Title,
  Card,
  ActionIcon,
  Tooltip,
  LoadingOverlay,
  Menu,
  Button,
  Text,
  Badge,
  Chip,
  Divider,
} from '@mantine/core';
import {
  IconRocket,
  IconRefresh,
  IconAdjustments,
  IconLayoutList,
  IconLayoutGrid,
  IconArrowUp,
  IconArrowDown,
  IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { useDocumentTitle } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { spacexApi } from '../api/spacex-api';
import { Layout } from '../components/Layout';
import { ErrorFallback } from '../components/errorFallback';

import { PAGE_SIZE } from '../utils/constant';
import { DataTable } from '../components/DataTable';
import { EmptyState } from '../components/EmptyState';
import { FilterTabs } from '../components/FilterTabs';
import { GridView } from '../components/GridView';
import { PaginationControls } from '../components/PaginationControls';
import { SearchBar } from '../components/SearchBar';
import { SortState, LaunchesResponse } from '../types';
import { LaunchesListSkeleton } from '../components/LaunchesListSkeleton';

export const LaunchesListPage: React.FC = () => {
  useDocumentTitle('SpaceX Launches Explorer');
  const navigate = useNavigate();

  // State management
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [successFilter, setSuccessFilter] = useState('all');
  const [sortState, setSortState] = useState<SortState>({ field: 'date_utc', order: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState('all');

  // Fetch launches
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<LaunchesResponse, Error>({
    queryKey: ['launches', page, pageSize, search, successFilter, sortState],
    queryFn: () =>
      spacexApi.getLaunches({
        page,
        limit: pageSize,
        search,
        success: successFilter === 'all' ? undefined : successFilter === 'successful',
        sortField: sortState.field ?? undefined,
        sortOrder: sortState.order ?? undefined,
      }),
    keepPreviousData: true,
  });

  // Debounced search
  const debouncedSearch = React.useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput, debouncedSearch]);

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      setSuccessFilter('all');
    } else if (value === 'successful') {
      setSuccessFilter('successful');
    } else if (value === 'failed') {
      setSuccessFilter('failed');
    }
    setPage(1);
  };

  const handleSortChange = (field: string) => {
    setSortState((prev:SortState) => {
      if (prev.field === field && prev.order === 'asc') {
        return { field, order: 'desc' };
      } else if (prev.field === field && prev.order === 'desc') {
        return { field: null, order: null };
      }
      return { field, order: 'asc' };
    });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const handleRowClick = (id: string) => {
    navigate(`/launch/${id}`);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSuccessFilter('all');
    setSortState({ field: null, order: null });
    setActiveTab('all');
    setPage(1);
  };

  if (isError) {
    return (
      <Layout>
        <ErrorFallback error={error} resetError={refetch} />
      </Layout>
    );
  }
  if(isLoading){
    return <LaunchesListSkeleton viewMode={viewMode} />
  }

  return (
    <Layout >
      <Container size="xl" px="xs" >
        <Box mb="xl" pos="relative">
          
          <Group position="apart" mb="lg" sx={{ transition: 'opacity 0.5s' }}>
            <Group>
              <IconRocket size={32} color="blue.6" />
              <Title order={2}>SpaceX Launches Explorer</Title>
            </Group>
            <SearchBar value={searchInput} onChange={handleSearchChange} />
          </Group>

          <Card shadow="sm" p="md" radius="md" mb="lg" withBorder>
            <Group position="apart">
              <FilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
              <Group spacing="xs">
                <Tooltip label="Refresh data">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => refetch()}
                    loading={isFetching && !isLoading}
                    aria-label="Refresh launches"
                  >
                    <IconRefresh size={18} />
                  </ActionIcon>
                </Tooltip>
                <Menu withinPortal position="bottom-end" shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="light" color="gray" aria-label="Sort and page size options">
                      <IconAdjustments size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Sort by</Menu.Label>
                    <Menu.Item
                      icon={
                        sortState.field === 'name' && sortState.order === 'asc' ? (
                          <IconArrowUp size={14} />
                        ) : sortState.field === 'name' && sortState.order === 'desc' ? (
                          <IconArrowDown size={14} />
                        ) : null
                      }
                      onClick={() => handleSortChange('name')}
                    >
                      Mission Name
                    </Menu.Item>
                    <Menu.Item
                      icon={
                        sortState.field === 'flight_number' && sortState.order === 'asc' ? (
                          <IconArrowUp size={14} />
                        ) : sortState.field === 'flight_number' && sortState.order === 'desc' ? (
                          <IconArrowDown size={14} />
                        ) : null
                      }
                      onClick={() => handleSortChange('flight_number')}
                    >
                      Flight Number
                    </Menu.Item>
                    <Menu.Item
                      icon={
                        sortState.field === 'date_utc' && sortState.order === 'asc' ? (
                          <IconArrowUp size={14} />
                        ) : sortState.field === 'date_utc' && sortState.order === 'desc' ? (
                          <IconArrowDown size={14} />
                        ) : null
                      }
                      onClick={() => handleSortChange('date_utc')}
                    >
                      Launch Date
                    </Menu.Item>
                    <Divider />
                    <Menu.Label>Items per page</Menu.Label>
                    <Menu.Item onClick={() => handlePageSizeChange('6')}>6 per page</Menu.Item>
                    <Menu.Item onClick={() => handlePageSizeChange('10')}>10 per page</Menu.Item>
                    <Menu.Item onClick={() => handlePageSizeChange('20')}>20 per page</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <Group spacing={4}>
                  <ActionIcon
                    variant={viewMode === 'list' ? 'filled' : 'light'}
                    color={viewMode === 'list' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <IconLayoutList size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant={viewMode === 'grid' ? 'filled' : 'light'}
                    color={viewMode === 'grid' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <IconLayoutGrid size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            </Group>
          </Card>

          {(search || successFilter !== 'all' || sortState.field) && (
            <Group spacing="xs" mb="md">
              <Text size="sm" color="dimmed">
                Active filters:
              </Text>
              {search && (
                <Badge
                  variant="filled"
                  size="lg"
                  color="blue"
                  rightSection={
                    <ActionIcon size="xs" color="blue" onClick={() => setSearchInput('')} aria-label="Clear search filter">
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  Search: {search}
                </Badge>
              )}
              {successFilter !== 'all' && (
                <Chip
                  checked={true}
                  variant="filled"
                  size="xs"
                  color={successFilter === 'successful' ? 'teal' : 'red'}
                >
                  Status: {successFilter}
                </Chip>
              )}
              {sortState.field && (
                <Chip checked={true} variant="filled" size="xs" color="blue">
                  Sort: {sortState.field} ({sortState.order})
                </Chip>
              )}
              <Button variant="subtle" compact onClick={handleResetFilters} aria-label="Clear all filters">
                Clear all
              </Button>
            </Group>
          )}

          {data?.docs.length === 0 ? (
            <EmptyState search={search} successFilter={successFilter} onReset={handleResetFilters} />
          ) : (
            <>
              {viewMode === 'list' && (
                <DataTable
                  data={data?.docs || []}
                  sortState={sortState}
                  onSortChange={handleSortChange}
                  onRowClick={handleRowClick}
                  isLoading={isLoading}
                />
              )}
              {viewMode === 'grid' && (
                <GridView data={data?.docs || []} onRowClick={handleRowClick} isLoading={isLoading} />
              )}
              <PaginationControls
                page={page}
                pageSize={pageSize}
                totalPages={data?.totalPages || 1}
                totalDocs={data?.totalDocs || 0}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Box>
      </Container>
    </Layout>
  );
};