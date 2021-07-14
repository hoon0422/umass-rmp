import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth';
import searchSlice from './search';
import rateSlice from './rate';

export const store = configureStore({
  reducer: {
    user: authSlice.reducer,
    search: searchSlice.reducer,
    rate: rateSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { clearUserState, reload } = authSlice.actions;
export { signIn, signUp } from './auth';
export const { setField, setMajor, setInput, clearSearchState } =
  searchSlice.actions;
export { search } from './search';
export const { clearRateState, startEditing, stopEditing } = rateSlice.actions;
export {
  getSectionDescription,
  getRatesExceptMine,
  getMyRate,
  writeRate,
  editRate,
  deleteRate,
} from './rate';

export const userSelector = (state: RootState) => state.user;
export const searchSelector = (state: RootState) => state.search;
export const rateSelector = (state: RootState) => state.rate;
