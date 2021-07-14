import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserSignInDto, UserSignUpDto } from '@dto/request';
import { ResError, JwtPayload } from '@dto/response';
import * as userServices from '@services/auth';
import * as jwt from 'jsonwebtoken';

const name = 'auth';

export interface IUserState {
  signInStatus: 'pending' | 'fulfilled' | 'rejected';
  signUpStatus: 'pending' | 'fulfilled' | 'rejected';
  jwtUser?: JwtPayload;
  signInError?: ResError;
  signUpError?: ResError;
}

export const signIn = createAsyncThunk<
  JwtPayload,
  UserSignInDto,
  { rejectValue: ResError }
>(
  `${name}/signIn`,
  async (userSignInDto: UserSignInDto, { rejectWithValue }) =>
    await userServices.signIn(userSignInDto).catch((e) => {
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

export const signUp = createAsyncThunk<
  JwtPayload,
  UserSignUpDto,
  { rejectValue: ResError }
>(
  `${name}/signUp`,
  async (userSignUpDto: UserSignUpDto, { rejectWithValue }) =>
    await userServices.signUp(userSignUpDto).catch((e) => {
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
    signInStatus: 'fulfilled',
    signUpStatus: 'fulfilled',
  } as IUserState,
  reducers: {
    clearUserState: (state) => {
      state.signInStatus = 'fulfilled';
      state.signUpStatus = 'fulfilled';
      state.signInError = undefined;
      state.signUpError = undefined;
    },
    reload: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      if (!!accessToken) {
        try {
          state.jwtUser = jwt.verify(
            accessToken,
            process.env.REACT_APP_SECRET as string,
          ) as JwtPayload;
        } catch (error) {
          if (error instanceof jwt.TokenExpiredError) {
            localStorage.removeItem('accessToken');
            state.jwtUser = undefined;
            return;
          }
          throw error;
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state, action) => {
        state.signInStatus = action.meta.requestStatus;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.signInStatus = action.meta.requestStatus;
        state.jwtUser = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.signInStatus = action.meta.requestStatus;
        state.signInError = action.payload;
      })
      .addCase(signUp.pending, (state, action) => {
        state.signUpStatus = action.meta.requestStatus;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUpStatus = action.meta.requestStatus;
        state.jwtUser = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpStatus = action.meta.requestStatus;
        state.signUpError = action.payload;
      });
  },
});
