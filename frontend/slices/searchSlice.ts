import { SearchType } from '@utils/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  type: SearchType;
  loading: boolean;
}

const initialState: SearchState = {
  type: SearchType.Games,
  loading: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchType: (state, action: PayloadAction<SearchType>) => {
      state.type = action.payload;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSearchType, setSearchLoading } = searchSlice.actions;
export default searchSlice.reducer;
