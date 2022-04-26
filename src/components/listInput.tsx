import { Input, Tag } from 'antd';
import React, { useState, KeyboardEvent } from 'react';
import styles from '@styles/listInput.module.scss';

interface listInputProps {
    inputs: string[];
    setInputs: React.Dispatch<React.SetStateAction<string[]>>;
  }

const ListInput = ({inputs, setInputs}: listInputProps) => {
  const [value, setValue] = useState('');

  const onPressEnter = (e: KeyboardEvent) => {
    setInputs((prevState: string[]) => [...prevState, (e.target as HTMLInputElement).value]);
    setValue('');
  };

  return (
    <>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={onPressEnter}
      />
      {inputs.map((input, index) => (
        <Tag className={styles.tag} key={index}>{input}</Tag>
      ))}
    </>
  );
};

export { ListInput };
