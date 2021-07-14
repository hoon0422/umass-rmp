import { Season } from '@dto/response';
import { searchSelector } from '@store';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ResultTableView from './ResultTableView';

export interface ISectionRow {
  key: number;
  id: number;
  order: number;
  title: string;
  courseNumber: string;
  category: string;
  professors: string;
  semester: string;
}

export interface IColumn {
  title: string;
  key: string;
  dataIndex: string;
  [x: string]: any;
}
const columns: IColumn[] = [
  {
    title: 'Order',
    key: 'Order',
    dataIndex: 'order',
    width: 50,
    align: 'center',
  },
  {
    title: 'Course Title',
    key: 'Course Title',
    dataIndex: 'title',
    width: 250,
  },
  {
    title: 'Course Number',
    key: 'Course Number',
    dataIndex: 'courseNumber',
    width: 150,
    align: 'center',
  },
  {
    title: 'Category',
    key: 'Category',
    dataIndex: 'category',
    width: 120,
    align: 'center',
  },
  {
    title: 'Professors',
    key: 'Professors',
    dataIndex: 'professors',
    width: 200,
  },
  {
    title: 'Semester',
    key: 'Semester',
    dataIndex: 'semester',
    width: 50,
    align: 'center',
    render: (t: string) => <span style={{ whiteSpace: 'nowrap' }}>{t}</span>,
  },
];

const seasonAbbr = {
  [Season.Spring]: 'SP',
  [Season.Summer]: 'SU',
  [Season.Fall]: 'FA',
  [Season.Winter]: 'WIN',
};

export default function ResultTableContainer() {
  const history = useHistory();
  const { sections } = useSelector(searchSelector);
  const sectionViews = sections.map(
    (section, idx) =>
      ({
        key: section.id,
        id: section.id,
        order: idx + 1,
        title: section.course.title,
        courseNumber: section.course.courseNumber,
        category: section.category.name,
        professors: section.professors.map((p) => p.name).join(', '),
        semester: `${seasonAbbr[section.course.semester.season]} ${
          section.course.semester.year
        }`,
      } as ISectionRow),
  );
  const selectSection = (section: ISectionRow) => {
    history.push(`/section/${section.id}`);
  };
  return (
    <ResultTableView
      dataSource={sectionViews}
      columns={columns}
      onRowSelected={selectSection}
    />
  );
}
