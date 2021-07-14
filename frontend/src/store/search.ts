import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldType, SearchDto } from '@dto/request';
import { ResError, SearchedSection } from '@dto/response';
import * as searchService from '@services/search';

const name = 'search';

export interface ISearchState {
  status: 'pending' | 'fulfilled' | 'rejected';
  field: FieldType;
  major: number;
  input: string;
  sections: SearchedSection[];
  searchError?: ResError;
}

export const search = createAsyncThunk<
  SearchedSection[],
  SearchDto,
  { rejectValue: ResError }
>(`${name}/search`, async (searchDto: SearchDto, { rejectWithValue }) => {
  return await searchService.search(searchDto).catch((e) => {
    if (
      !e.response ||
      !e.response.data ||
      !Array.isArray(e.response.data.message)
    ) {
      throw e;
    }
    return rejectWithValue(e.response.data);
  });
});

export default createSlice({
  name,
  initialState: {
    status: 'fulfilled',
    field: 'title',
    major: 0,
    input: '',
    sections: [],
  } as ISearchState,
  reducers: {
    setField: {
      reducer: (state, action: PayloadAction<FieldType>) => {
        state.field = action.payload;
      },
      prepare: (field: FieldType) => ({
        payload: field,
      }),
    },
    setMajor: {
      reducer: (state, action: PayloadAction<number>) => {
        state.major = action.payload;
      },
      prepare: (field: number) => ({
        payload: field,
      }),
    },
    setInput: {
      reducer: (state, action: PayloadAction<string>) => {
        state.input = action.payload;
      },
      prepare: (field: string) => ({
        payload: field,
      }),
    },
    clearSearchState: (state) => {
      state.status = 'fulfilled';
      state.field = 'title';
      state.major = 0;
      state.input = '';
      state.sections = [];
      state.searchError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state, action) => {
        state.status = action.meta.requestStatus;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.status = action.meta.requestStatus;
        state.sections = action.payload;
        state.searchError = undefined;
      })
      .addCase(search.rejected, (state, action) => {
        state.status = action.meta.requestStatus;
        state.searchError = action.payload;
      });
  },
});
