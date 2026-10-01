import { createSlice } from '@reduxjs/toolkit';

const read = () => {
  try {
    const t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') return t;
  } catch { /* storage unavailable */ }
  return 'dark';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: read() },
  reducers: {
    toggleTheme(state) { state.mode = state.mode === 'dark' ? 'light' : 'dark'; },
    setTheme(state, { payload }) { state.mode = payload === 'light' ? 'light' : 'dark'; },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
