import { Rate } from '@dto/response';
import { RateDto } from '@dto/request';
import { editRate, writeRate, rateSelector, stopEditing } from '@store';
import { getNotFoundPath } from '@navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { RateForm } from '.';
import RateFormView from './RateFormView';

type props = {
  defaultRate?: Rate;
};

export default function RateFormContainer({ defaultRate }: props) {
  const dispatch = useDispatch();
  const match = useRouteMatch<{ sectionId: string }>();
  const sectionId = Number(match.params.sectionId);
  const { writeRateStatus, editRateStatus, writeRateError, editRateError } =
    useSelector(rateSelector);

  if (isNaN(sectionId)) {
    return <Redirect to={getNotFoundPath()} />;
  }

  const onPostFinish = (rateForm: RateForm) => {
    const rateDto: RateDto = {
      overallScore: rateForm.overallScore,
      easyness: rateForm.easyness,
      learned: rateForm.learned,
      teaching: rateForm.teaching,
      rate: rateForm.rate,
    };

    if (!!defaultRate) {
      dispatch(editRate({ rateId: defaultRate.id, rateDto }));
    } else {
      dispatch(writeRate({ sectionId, rateDto }));
    }
  };

  return (
    <RateFormView
      defaultRate={defaultRate}
      onPostFinish={onPostFinish}
      onCancel={() => dispatch(stopEditing())}
      writeRateStatus={writeRateStatus}
      editRateStatus={editRateStatus}
      writeRateError={writeRateError}
      editRateError={editRateError}
    />
  );
}
