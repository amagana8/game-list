import { Select, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Genre, Platform } from '@utils/types';
import { Dispatch, SetStateAction } from 'react';
import styles from './GameFilter.module.scss';

interface GameFiltersProps {
  platforms: Platform[];
  genres: Genre[];
  setPlatforms: Dispatch<SetStateAction<String[]>>;
  setGenres: Dispatch<SetStateAction<String[]>>;
  horizontal?: boolean;
}

const GameFilters = ({
  platforms,
  genres,
  setPlatforms,
  setGenres,
  horizontal,
}: GameFiltersProps) => {
  return (
    <>
      <Title level={4}>Filters</Title>
      <Space direction={horizontal ? 'horizontal' : 'vertical'}>
        <Select
          className={styles.select}
          dropdownClassName={styles.dropdown}
          mode="multiple"
          filterOption={true}
          placeholder="Platform"
          options={platforms.map((platform) => ({
            value: platform.name,
          }))}
          onChange={(values: String[]) => setPlatforms(values)}
        />
        <Select
          className={styles.select}
          dropdownClassName={styles.dropdown}
          mode="multiple"
          filterOption={true}
          placeholder="Genre"
          options={genres.map((genre) => ({
            value: genre.name,
          }))}
          onChange={(values: String[]) => setGenres(values)}
        />
      </Space>
    </>
  );
};

export { GameFilters };
