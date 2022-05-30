import { useQuery } from '@apollo/client';
import { SearchCompanies } from '@graphql/queries';
import { Select } from 'antd';
import React, { useState } from 'react';

const ListInput = ({ value, onChange }: any) => {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  useQuery(SearchCompanies, {
    variables: {
      query: input,
    },
    onCompleted: (data) => {
      setList(data.searchCompanies);
    },
  });

  const options = list.map((company: any) => (
    <Select.Option key={company.id} value={company.id}>
      {company.name}
    </Select.Option>
  ));

  const handleChange = (newValue: string[]) => {
    setInput('');
    value = newValue;
    onChange(value);
  };

  return (
    <Select
      showSearch
      onSearch={setInput}
      filterOption={false}
      mode="multiple"
      onChange={handleChange}
    >
      {options}
    </Select>
  );
};

export { ListInput };
