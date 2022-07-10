import { InputNumber, Popover, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { UpdateListEntry } from '@graphql/mutations';
import { Dispatch, SetStateAction, useState } from 'react';
import { PopoverType } from '@utils/enums';
import { useAuthStore } from '@frontend/authStore';
import { toTitleCase } from '@utils/toTitleCase';
import { TableEntry } from '@utils/types';

interface ListPopoverProps {
  value: number;
  row: TableEntry;
  type: PopoverType;
  tableData: TableEntry[];
  setTableData: Dispatch<SetStateAction<TableEntry[]>>;
  editable: boolean;
}

const ListPopover = ({
  value,
  row,
  type,
  tableData,
  setTableData,
  editable,
}: ListPopoverProps) => {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState<number>(value);
  const [updateListEntry] = useMutation(UpdateListEntry);
  const username = useAuthStore((state) => state.username);

  const onPressEnter = async () => {
    const newEdge = {
      [type === PopoverType.Hours ? 'hours' : 'score']: inputValue,
    };

    try {
      await updateListEntry({
        variables: {
          where: {
            username,
          },
          update: {
            gameList: [
              {
                update: {
                  edge: { ...newEdge },
                },
                where: {
                  node: {
                    slug: row.slug,
                  },
                },
              },
            ],
          },
          gameListConnectionWhere: {
            node: {
              slug: row.slug,
            },
          },
        },
      });
      const newData = [...tableData];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...newEdge,
      });
      setTableData(newData);
      message.success(`${toTitleCase(type)} for ${row.title} updated!`);
    } catch (e) {
      message.error(`Failed to update ${toTitleCase(type)} for ${row.title}.`);
      console.log(e);
    }
    setVisible(false);
  };

  return (
    <>
      {editable ? (
        <Popover
          title={toTitleCase(type)}
          trigger="click"
          visible={visible}
          onVisibleChange={(newValue) => setVisible(newValue)}
          content={
            <InputNumber
              value={inputValue}
              onChange={setInputValue}
              onPressEnter={onPressEnter}
            />
          }
        >
          <Button type="text">{value ?? '-'}</Button>
        </Popover>
      ) : (
        <>{value ?? '-'}</>
      )}
    </>
  );
};

export { ListPopover };
