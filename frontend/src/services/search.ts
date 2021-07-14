import { SearchDto } from '@dto/request';
import { Major, SearchField, SearchedSection } from '@dto/response';
import axios from 'axios';
import { classToPlain } from 'class-transformer';

export const loadMajors = async () => {
  const response = await axios.get<Major[]>('/search/majors');
  return response.data as Major[];
};

export const loadSearchFields = async () => {
  const response = await axios.get<SearchField[]>('/search/search-fields');
  return response.data as SearchField[];
};

export const search = async (searchDto: SearchDto) => {
  const response = await axios.get<SearchedSection[]>('/search', {
    params: classToPlain<SearchDto>(searchDto),
  });
  return response.data as SearchedSection[];
};
