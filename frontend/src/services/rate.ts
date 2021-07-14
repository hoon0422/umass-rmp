import { RateDto } from '@dto/request';
import { Rate, SectionDescription } from '@dto/response';
import { createBearerToken } from '@utils/auth';
import axios from 'axios';
import { classToPlain } from 'class-transformer';

export const getSectionDescription = async (sectionId: number) => {
  const response = await axios.get<SectionDescription>(
    `/section/${sectionId}`,
    { withCredentials: true },
  );
  return response.data as SectionDescription;
};

export const getRates = async (sectionId: number) => {
  const response = await axios.get<Rate[]>(`/rate/section/${sectionId}`, {
    headers: createBearerToken(),
    withCredentials: true,
  });
  return response.data as Rate[];
};

export const getMyRate = async (sectionId: number) => {
  const response = await axios.get<Rate>(`/rate/section/${sectionId}/my-rate`, {
    headers: createBearerToken(),
    withCredentials: true,
  });
  return response.data as Rate;
};

export const writeRate = async (sectionId: number, rateDto: RateDto) => {
  const response = await axios.post<Rate>(
    `/rate/section/${sectionId}`,
    classToPlain<RateDto>(rateDto),
    { headers: createBearerToken(), withCredentials: true },
  );
  return response.data as Rate;
};

export const editRate = async (rateId: number, rateDto: RateDto) => {
  const response = await axios.put<Rate>(
    `/rate/section/${rateId}`,
    classToPlain<RateDto>(rateDto),
    { headers: createBearerToken(), withCredentials: true },
  );
  return response.data as Rate;
};

export const deleteRate = async (rateId: number) => {
  const response = await axios.delete<Rate>(`/rate/section/${rateId}`, {
    headers: createBearerToken(),
    withCredentials: true,
  });
  return response.data as Rate;
};
