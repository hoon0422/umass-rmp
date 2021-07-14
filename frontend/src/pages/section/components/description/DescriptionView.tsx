import { SectionDescription, Weekday } from '@dto/response';
import { Descriptions } from 'antd';
import styled from 'styled-components';

const to2Digit = (n: number) => (n / 10 < 1 ? `0${n}` : `${n}`);

const weekdaySortCriteria = {
  [Weekday.Monday]: 1,
  [Weekday.Tuesday]: 2,
  [Weekday.Wednesday]: 3,
  [Weekday.Thursday]: 4,
  [Weekday.Friday]: 5,
  [Weekday.Saturday]: 6,
  [Weekday.Sunday]: 7,
};

const DescriptionTitle = styled.div`
  display: flex;
  direction: horizontal;
  justify-items: center;
  align-items: flex-end;
`;

const DescriptionMainTitle = styled.div`
  font-size: 20px;
`;

const DescriptionSubTitle = styled.div`
  margin-left: auto;
  font-size: 14px;
  color: #757575;
`;

export default function DescriptionView(section: SectionDescription) {
  return (
    <Descriptions
      bordered
      title={
        <DescriptionTitle>
          <DescriptionMainTitle>
            {section.course.courseNumber} - {section.course.title}
          </DescriptionMainTitle>
          <DescriptionSubTitle>
            Class #: {section.classNumber}
          </DescriptionSubTitle>
        </DescriptionTitle>
      }
    >
      <Descriptions.Item label="Professor(s)" span={2}>
        {section.professors.map((p) => p.name).join(', ')}
      </Descriptions.Item>
      <Descriptions.Item label="Major" span={1}>
        {section.course.major.name}
      </Descriptions.Item>
      <Descriptions.Item style={{ whiteSpace: 'nowrap' }} label="Semester">
        {`${section.course.semester.season} ${section.course.semester.year}`}
      </Descriptions.Item>
      <Descriptions.Item label="Category" span={1}>
        {section.category.name}
      </Descriptions.Item>
      <Descriptions.Item label="Components" span={2}>
        {section.components.map((c) => c.name).join(', ')}
      </Descriptions.Item>
      <Descriptions.Item label="Location" span={1}>
        {section.online
          ? 'On-Line'
          : !section.location || !section.location.location
          ? 'TBA or N/A'
          : section.location.location}
      </Descriptions.Item>
      <Descriptions.Item label="Time" span={1}>
        {section.sectionTimes.length !== 0
          ? section.sectionTimes
              .slice(0)
              .sort(
                (a, b) =>
                  weekdaySortCriteria[a.weekday] -
                  weekdaySortCriteria[b.weekday],
              )
              .map((st, i) => (
                <div style={{ whiteSpace: 'nowrap' }} key={i}>
                  {`${st.weekday} ${to2Digit(st.startHour)}:${to2Digit(
                    st.startMinute,
                  )} ~ ${to2Digit(st.endHour)}:${to2Digit(st.endMinute)}`}
                </div>
              ))
          : 'TBA or N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Units" span={1}>
        {section.minUnit === section.maxUnit
          ? section.minUnit
          : `${section.minUnit} ~ ${section.maxUnit}`}
      </Descriptions.Item>
    </Descriptions>
  );
}
