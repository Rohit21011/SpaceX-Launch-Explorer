import React from 'react';
import { Tabs } from '@mantine/core';
import { IconRocket, IconCheck, IconX } from '@tabler/icons-react';

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs
      value={activeTab}
      onTabChange={onTabChange}
      variant="pills"
      aria-label="Filter launches by status"
    >
      <Tabs.List>
        <Tabs.Tab value="all" icon={<IconRocket size={14} />}>
          All Launches
        </Tabs.Tab>
        <Tabs.Tab value="successful" icon={<IconCheck size={14} />}>
          Successful
        </Tabs.Tab>
        <Tabs.Tab value="failed" icon={<IconX size={14} />}>
          Failed
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};