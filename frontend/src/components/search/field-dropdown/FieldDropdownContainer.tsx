import { SearchField } from '@dto/response';
import { loadSearchFields } from '@services/search';
import { searchSelector, setField } from '@store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FieldDropdownView from './FieldDropdownView';

type props = {
  width?: number;
};

export default function FieldDropdownContainer({ width }: props) {
  const [fields, setFields] = useState([] as SearchField[]);
  const dispatch = useDispatch();
  const { field } = useSelector(searchSelector);

  useEffect(() => {
    loadSearchFields().then((searchFields) => setFields(searchFields));
  }, []);

  return (
    <FieldDropdownView
      fields={fields}
      currentField={field}
      setField={(field) => {
        dispatch(setField(field));
      }}
      width={width}
    />
  );
}
