import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Title,
  Group,
  Pagination,
  Text,
  Box,
  useMantineTheme,
  Paper,
  Select,
  Table,
  ScrollArea,
} from '@mantine/core';
import { IconSearch, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { useDocumentTitle } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { spacexApi } from '../api/spacex-api';
import { Layout } from '../components/Layout';
import { LaunchesResponse } from '../types';
import { PAGE_SIZE } from '../utils/constant';
import { ErrorFallback } from '../components/errorFallback';

interface SortState {
  field: string | null;
  order: 'asc' | 'desc' | null;
}

export const LaunchesListPage: React.FC = () => {
  useDocumentTitle('Launches');
  const theme = useMantineTheme();
  const navigate = useNavigate();

  // State for search, filter, sort, and pagination
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [successFilter, setSuccessFilter] = useState<string | null>('all');
  const [sortState, setSortState] = useState<SortState>({ field: null, order: null });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);

  // Fetch launches with search, filter, sort, and pagination
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<LaunchesResponse, any>({
    queryKey: ['launches', page, pageSize, search, successFilter, sortState],
    queryFn: () => spacexApi.getLaunches({ 
      page, 
      limit: pageSize, 
      search,
      success: successFilter === 'all' ? undefined : successFilter === 'successful'?true:false,
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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSuccessFilterChange = (value: string | null) => {
    setSuccessFilter(value);
    setPage(1);
  };

  const handleSortChange = (field: string) => {
    setSortState((prev) => {
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

  // Render sort icon
  const renderSortIcon = (field: string) => {
    if (sortState.field !== field || !sortState.order) return null;
    return sortState.order === 'asc' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />;
  };

  if (isError) {
    return (
      <Layout>
        <ErrorFallback error={error} resetError={refetch} />
      </Layout>
    );
  }

  return (
    <Layout loading={isLoading && !data}>
      <Box mb="xl">
        <Group position="apart" mb="lg">
          <Title>SpaceX Launches</Title>
          <Group>
            <TextInput
              placeholder="Search by name or details..."
              icon={<IconSearch size={16} />}
              value={searchInput}
              onChange={handleSearchChange}
              style={{ width: 300 }}
            />
            <Select
           
              value={successFilter}
              onChange={handleSuccessFilterChange}
              data={[
                { value: 'all', label: 'All Launches' },
                { value: 'successful', label: 'Successful' },
                { value: 'failed', label: 'Failed' },
              ]}
              style={{ width: 150 }}
            />
          </Group>
        </Group>

        {data?.docs.length === 0 ? (
          <Paper p="xl" withBorder>
            <Text align="center">
              No launches found{search ? ` matching "${search}"` : ''}
              {successFilter !== 'all' ? ` with status "${successFilter}"` : ''}
            </Text>
          </Paper>
        ) : (
          <>
            <ScrollArea>
              <Table highlightOnHover verticalSpacing="sm">
                <thead>
                  <tr>
                    <th>
                      <Group spacing={4} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('name')}>
                        <Text>Name</Text>
                        {renderSortIcon('name')}
                      </Group>
                    </th>
                    <th>
                      <Group spacing={4} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('flight_number')}>
                        <Text>Flight Number</Text>
                        {renderSortIcon('flight_number')}
                      </Group>
                    </th>
                    <th>
                      <Group spacing={4} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('date_utc')}>
                        <Text>Date</Text>
                        {renderSortIcon('date_utc')}
                      </Group>
                    </th>
                    <th>Success</th>
                    <th>Rocket</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.docs.map((launch) => (
                    <tr 
                      key={launch.id} 
                      onClick={() => handleRowClick(launch.id)} 
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{launch.name || 'N/A'}</td>
                      <td>{launch.flight_number || 'N/A'}</td>
                      <td>{launch.date_utc ? new Date(launch.date_utc).toLocaleDateString() : 'N/A'}</td>
                      <td>{launch.success !== null ? (launch.success ? 'Yes' : 'No') : 'N/A'}</td>
                      <td>{launch.name || 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>

            <Group position="apart" mt="xl">
              <Group>
                <Text size="sm">Show:</Text>
                <Select
                  value={String(pageSize)}
                  onChange={handlePageSizeChange}
                  data={[
                    { value: '6', label: '6 per page' },
                    { value: '10', label: '10 per page' },
                    { value: '20', label: '20 per page' },
                  ]}
                  style={{ width: 120 }}
                />
              </Group>
              
              <Pagination
                total={data?.totalPages || 1}
                value={page}
                onChange={handlePageChange}
                withEdges
              />
            </Group>
          </>
        )}
      </Box>
    </Layout>
  );
};