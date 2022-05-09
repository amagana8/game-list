import { Button, Input, Tag } from 'antd';
import React, { useState } from 'react';
import styles from '@styles/listInput.module.scss';

interface listInputProps {
  inputs: string[];
  setInputs: React.Dispatch<React.SetStateAction<string[]>>;
  type: string;
}

const ListInput = ({ inputs, setInputs, type }: listInputProps) => {
  const [value, setValue] = useState('');

  const addItem = () => {
    setInputs((prevState: string[]) => [...prevState, value]);
    setValue('');
  };

  const onClose = (input: string) => {
    const newState = inputs.filter(item => item !== input);
    setInputs(newState);
  };

  return (
    <>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={addItem}
      />
      {inputs.map((input, index) => (
        <Tag closable onClose={() => onClose(input)} className={styles.tag} key={index}>
          {input}
        </Tag>
      ))}
      <div className={styles.addButton}>
        <Button onClick={addItem}>Add {type}</Button>
      </div>
    </>
  );
};

export { ListInput };
