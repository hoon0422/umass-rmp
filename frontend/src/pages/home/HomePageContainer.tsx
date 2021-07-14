import { FieldType, SearchDto } from '@dto/request';
import HomePageView from './HomePageView';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { search, clearSearchState } from '@store';
import { useEffect } from 'react';

type props = RouteComponentProps<Record<string, never>>;

export default function HomePageContainer({ location }: props) {
  const dispatch = useDispatch();
  const onDashboard = location.search === '';

  useEffect(() => {
    if (onDashboard) {
      dispatch(clearSearchState());
    }
  }, []);

  if (!onDashboard) {
    const query = new URLSearchParams(location.search);
    const searchDto = new SearchDto();
    searchDto.field = query.get('field') as FieldType;
    searchDto.majorId = Number(query.get('majorId'));
    searchDto.searchKey = query.get('input') || '';
    dispatch(search(searchDto));
  }

  return <HomePageView showBanner={onDashboard} />;
}
