import { Table } from 'antd';
import { IColumn, ISectionRow } from './ResultTableContainer';

type props = {
  dataSource: ISectionRow[];
  columns: IColumn[];
  onRowSelected: (row: ISectionRow) => any;
};

export default function ResultTableView({
  dataSource,
  columns,
  onRowSelected,
}: props) {
  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      onRow={(record) => ({
        onClick: () => {
          onRowSelected(record);
        },
      })}
    />
  );
}
