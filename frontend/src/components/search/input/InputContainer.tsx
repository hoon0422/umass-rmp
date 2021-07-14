import { getHomePath } from '@navigation';
import { searchSelector, setInput } from '@store';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import InputView from './InputView';

type props = {
  width?: number | string;
};

export default function InputContainer({ width }: props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { field, major, input } = useSelector(searchSelector);
  return (
    <InputView
      defaultInput={input}
      setInput={(input) => {
        dispatch(setInput(input));
      }}
      search={() => {
        const query = new URLSearchParams({
          field: field,
          majorId: major.toString(),
          input,
        }).toString();
        history.push(`${getHomePath()}?${query}`);
      }}
      width={width}
    />
  );
}
