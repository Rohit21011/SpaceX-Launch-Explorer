import React from 'react';
import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <TextInput
      placeholder="Search missions..."
      icon={<IconSearch size={16} />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: 300 }}
      aria-label="Search launches"
      rightSection={
        value ? (
          <ActionIcon onClick={() => onChange('')} aria-label="Clear search">
            <IconX size={16} />
          </ActionIcon>
        ) : null
      }
    />
  );
};