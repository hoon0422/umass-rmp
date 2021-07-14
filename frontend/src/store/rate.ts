import { RateDto } from '@dto/request';
import { ResError, Rate, SectionDescription, User } from '@dto/response';
import * as rateService from '@services/rate';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

const name = 'rate';

export interface IRateState {
  getSectionDescriptionStatus: 'pending' | 'fulfilled' | 'rejected';
  getRatesExceptMineStatus: 'pending' | 'fulfilled' | 'rejected';
  getMyRateStatus: 'pending' | 'fulfilled' | 'rejected';
  writeRateStatus: 'pending' | 'fulfilled' | 'rejected';
  editRateStatus: 'pending' | 'fulfilled' | 'rejected';
  deleteRateStatus: 'pending' | 'fulfilled' | 'rejected';
  section?: SectionDescription;
  rates: Rate[];
  editing: boolean;
  myRate?: Rate;
  getSectionDescriptionError?: ResError;
  getRatesError?: ResError;
  getMyRateError?: ResError;
  writeRateError?: ResError;
  editRateError?: ResError;
  deleteRateError?: ResError;
}

export const getSectionDescription = createAsyncThunk<
  SectionDescription,
  { sectionId: number },
  { rejectValue: ResError }
>(
  `${name}/getSectionDescription`,
  async ({ sectionId }: { sectionId: number }, { rejectWithValue }) => {
    return await rateService.getSectionDescription(sectionId).catch((e) => {
      if (
        !e.response ||
        !e.response.data ||
        !Array.isArray(e.response.data.message)
      ) {
        throw e;
      }
      return rejectWithValue(e.response.data);
    });
  },
);

export const getRatesExceptMine = createAsyncThunk<
  Rate[],
  { sectionId: number },
  { state: RootState; rejectValue: ResError }
>(
  `${name}/getRates`,
  async (
    { sectionId }: { sectionId: number },
    { getState, rejectWithValue },
  ) => {
    let rates: Rate[];
    try {
      rates = await rateService.getRates(sectionId);
    } catch (e) {
      if (
        !e.response ||
        !e.response.data ||
        !Array.isArray(e.response.data.message)
      ) {
        throw e;
      }
      return rejectWithValue(e.response.data);
    }
    const userId = (getState().user.jwtUser as User).id;
    const myRateIdx = rates.findIndex((r) => r.user.id === userId);
    if (myRateIdx >= 0) {
      rates.splice(myRateIdx, 1)[0];
    }
    return rates;
  },
);

export const getMyRate = createAsyncThunk<
  Rate | null,
  { sectionId: number },
  { rejectValue: ResError }
>(
  `${name}/getMyRate`,
  async ({ sectionId }: { sectionId: number }, { rejectWithValue }) =>
    await rateService.getMyRate(sectionId).catch((e) => {
      if (
        !e.response ||
        !e.response.data ||
        !Array.isArray(e.response.data.message)
      ) {
        throw e;
      }
      return rejectWithValue(e.response.data);
    }),
);

export const writeRate = createAsyncThunk<
  Rate,
  { sectionId: number; rateDto: RateDto },
  { rejectValue: ResError }
>(
  `${name}/writeRate`,
  async (
    { sectionId, rateDto }: { sectionId: number; rateDto: RateDto },
    { rejectWithValue },
  ) =>
    await rateService.writeRate(sectionId, rateDto).catch((e) => {
      if (
        !e.response ||
        !e.response.data ||
        !Array.isArray(e.response.data.message)
      ) {
        throw e;
      }
      return rejectWithValue(e.response.data);
    }),
);

export const editRate = createAsyncThunk<
  Rate,
  { rateId: number; rateDto: RateDto },
  { rejectValue: ResError }
>(
  `${name}/editRate`,
  async (
    { rateId, rateDto }: { rateId: number; rateDto: RateDto },
    { rejectWithValue },
  ) =>
    await rateService.editRate(rateId, rateDto).catch((e) => {
      if (
        !e.response ||
        !e.response.data ||
        !Array.isArray(e.response.data.message)
      ) {
        throw e;
      }
      return rejectWithValue(e.response.data);
    }),
);

export const deleteRate = createAsyncThunk<
  Rate,
  { rateId: number },
  { rejectValue: ResError }
>(
  `${name}/deleteRate`,
  async ({ rateId }: { rateId: number }, { rejectWithValue }) =>
    await rateService.deleteRate(rateId).catch((e) => {
      if (
        !e.response ||
        !e.response.data ||
        !Array.isArray(e.response.data.message)
      ) {
        throw e;
      }
      return rejectWithValue(e.response.data);
    }),
);

export default createSlice({
  name,
  initialState: {
    getSectionDescriptionStatus: 'fulfilled',
    getRatesExceptMineStatus: 'fulfilled',
    getMyRateStatus: 'fulfilled',
    writeRateStatus: 'fulfilled',
    editRateStatus: 'fulfilled',
    deleteRateStatus: 'fulfilled',
    editing: true,
    rates: [],
  } as IRateState,
  reducers: {
    startEditing: (state) => {
      state.editing = true;
    },
    stopEditing: (state) => {
      state.editing = false;
      state.writeRateStatus = 'fulfilled';
      state.editRateStatus = 'fulfilled';
      state.writeRateError = undefined;
      state.editRateError = undefined;
    },
    clearRateState: (state) => {
      state.getSectionDescriptionStatus = 'fulfilled';
      state.getRatesExceptMineStatus = 'fulfilled';
      state.getMyRateStatus = 'fulfilled';
      state.writeRateStatus = 'fulfilled';
      state.editRateStatus = 'fulfilled';
      state.deleteRateStatus = 'fulfilled';
      state.section = undefined;
      state.rates = [];
      state.myRate = undefined;
      state.editing = true;
      state.getSectionDescriptionError = undefined;
      state.getRatesError = undefined;
      state.getMyRateError = undefined;
      state.writeRateError = undefined;
      state.editRateError = undefined;
      state.deleteRateError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSectionDescription.pending, (state, action) => {
        state.getSectionDescriptionStatus = action.meta.requestStatus;
      })
      .addCase(getSectionDescription.fulfilled, (state, action) => {
        state.getSectionDescriptionStatus = action.meta.requestStatus;
        state.section = action.payload;
      })
      .addCase(getSectionDescription.rejected, (state, action) => {
        state.getSectionDescriptionStatus = action.meta.requestStatus;
        state.getSectionDescriptionError = action.payload;
      })
      .addCase(getRatesExceptMine.pending, (state, action) => {
        state.getRatesExceptMineStatus = action.meta.requestStatus;
      })
      .addCase(getRatesExceptMine.fulfilled, (state, action) => {
        state.getRatesExceptMineStatus = action.meta.requestStatus;
        state.rates = action.payload;
      })
      .addCase(getRatesExceptMine.rejected, (state, action) => {
        state.getRatesExceptMineStatus = action.meta.requestStatus;
        state.getRatesError = action.payload;
      })
      .addCase(getMyRate.pending, (state, action) => {
        state.getMyRateStatus = action.meta.requestStatus;
      })
      .addCase(getMyRate.fulfilled, (state, action) => {
        state.getMyRateStatus = action.meta.requestStatus;
        state.myRate = !!action.payload ? action.payload : undefined;
        state.editing = !state.myRate;
      })
      .addCase(getMyRate.rejected, (state, action) => {
        state.getMyRateStatus = action.meta.requestStatus;
        state.getRatesError = action.payload;
      })
      .addCase(writeRate.pending, (state, action) => {
        state.writeRateStatus = action.meta.requestStatus;
      })
      .addCase(writeRate.fulfilled, (state, action) => {
        state.writeRateStatus = action.meta.requestStatus;
        state.myRate = action.payload;
        state.editing = false;
      })
      .addCase(writeRate.rejected, (state, action) => {
        state.writeRateStatus = action.meta.requestStatus;
        state.writeRateError = action.payload;
      })
      .addCase(editRate.pending, (state, action) => {
        state.editRateStatus = action.meta.requestStatus;
      })
      .addCase(editRate.fulfilled, (state, action) => {
        state.editRateStatus = action.meta.requestStatus;
        state.myRate = action.payload;
        state.editing = false;
      })
      .addCase(editRate.rejected, (state, action) => {
        state.editRateStatus = action.meta.requestStatus;
        state.editRateError = action.payload;
      })
      .addCase(deleteRate.pending, (state, action) => {
        state.deleteRateStatus = action.meta.requestStatus;
      })
      .addCase(deleteRate.fulfilled, (state, action) => {
        state.deleteRateStatus = action.meta.requestStatus;
        state.myRate = undefined;
      })
      .addCase(deleteRate.rejected, (state, action) => {
        state.deleteRateStatus = action.meta.requestStatus;
        state.deleteRateError = action.payload;
      });
  },
});
