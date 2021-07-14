import {
  clearRateState,
  rateSelector,
  getRatesExceptMine,
  getMyRate,
} from '@store';
import { getNotFoundPath } from '@navigation';
import { useEffect, useState } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SectionPageView from './SectionPageView';
import { User } from '@dto/response';
import { loadCurrentUserInfo } from '@services/user';

export default function SectionPageContainer() {
  const match = useRouteMatch<{ sectionId: string }>();
  const sectionId = Number(match.params.sectionId);
  const dispatch = useDispatch();
  const {
    rates,
    myRate,
    getRatesExceptMineStatus,
    getMyRateStatus,
    editing,
    getRatesError,
    getMyRateError,
  } = useSelector(rateSelector);
  const [userInfo, setUserInfo] = useState<User | undefined>(undefined);

  useEffect(() => {
    loadCurrentUserInfo()
      .then((user) => {
        setUserInfo(user);
      })
      .catch();
  }, []);

  useEffect(() => {
    if (
      isNaN(sectionId) ||
      (getRatesError && getRatesError.statusCode === 404)
    ) {
      return;
    }

    if (!!userInfo && getRatesExceptMineStatus !== 'pending') {
      dispatch(getRatesExceptMine({ sectionId }));
    }

    if (!!userInfo && getMyRateStatus !== 'pending') {
      dispatch(getMyRate({ sectionId }));
    }

    return () => {
      dispatch(clearRateState());
    };
  }, [userInfo]);

  if (isNaN(sectionId) || (getRatesError && getRatesError.statusCode === 404)) {
    return <Redirect to={getNotFoundPath()} />;
  }

  return (
    <SectionPageView
      editing={editing}
      sectionId={sectionId}
      rates={rates}
      myRate={myRate}
      userInfo={userInfo}
      getMyRateError={getMyRateError}
    />
  );
}
