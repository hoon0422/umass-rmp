import { loadMajors } from '@services/search';
import { searchSelector, setMajor } from '@store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Major } from '.';
import MajorDropdownView from './MajorDropdownView';

type props = {
  width?: number;
};

export default function MajorDropdownContainer({ width }: props) {
  const [majors, setMajors] = useState([] as Major[]);
  const dispatch = useDispatch();
  const { major } = useSelector(searchSelector);

  useEffect(() => {
    loadMajors().then((majors) =>
      setMajors([{ id: 0, name: 'All' }].concat(...majors)),
    );
  }, []);

  return (
    <MajorDropdownView
      majors={majors}
      currentMajorId={major}
      setMajor={(majorId) => {
        dispatch(setMajor(majorId));
      }}
      width={width}
    />
  );
}
