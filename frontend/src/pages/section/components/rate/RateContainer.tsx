import { Rate } from '@dto/response';
import { startEditing } from '@store';
import { useDispatch } from 'react-redux';
import RateView from './RateView';

type props = {
  rate: Rate;
  editable?: boolean;
};

export default function RateContainer({ rate, editable = false }: props) {
  const dispatch = useDispatch();
  return (
    <RateView
      rate={rate}
      startEditing={
        editable
          ? () => {
              dispatch(startEditing());
            }
          : undefined
      }
    />
  );
}
