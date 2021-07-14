import { rateSelector, getSectionDescription } from '@store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DescriptionView from './DescriptionView';

type props = { sectionId: number };
export default function DescriptionContainer({ sectionId }: props) {
  const dispatch = useDispatch();
  const { section, getSectionDescriptionStatus: getSectionStatus } =
    useSelector(rateSelector);

  useEffect(() => {
    if (getSectionStatus !== 'pending') {
      dispatch(getSectionDescription({ sectionId }));
    }
  }, []);
  if (getSectionStatus === 'pending' || !section) {
    return <></>;
  }
  return <DescriptionView {...section} />;
}
