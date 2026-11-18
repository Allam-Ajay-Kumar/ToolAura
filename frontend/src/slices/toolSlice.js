// src/slices/toolSlice.js
// Manages tools list, filters, loading state

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toolService from '../services/toolService';

const initialState = {
  tools: [],
  tool: null,
  categories: [],
  mySubmissions: [],
  myFavourites: [],
  total: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Fetch approved tools (with optional filters)
export const fetchTools = createAsyncThunk('tools/fetchAll', async (params, thunkAPI) => {
  try {
    return await toolService.getTools(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch single tool
export const fetchToolById = createAsyncThunk('tools/fetchOne', async (id, thunkAPI) => {
  try {
    return await toolService.getToolById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch categories
export const fetchCategories = createAsyncThunk('tools/fetchCategories', async (_, thunkAPI) => {
  try {
    return await toolService.getCategories();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Submit a tool
export const submitTool = createAsyncThunk('tools/submit', async (toolData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await toolService.submitTool(toolData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch my submissions
export const fetchMySubmissions = createAsyncThunk('tools/mySubmissions', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await toolService.getMySubmissions(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch favourites
export const fetchMyFavourites = createAsyncThunk('tools/myFavourites', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await toolService.getMyFavourites(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Add to favourites
export const addFavourite = createAsyncThunk('tools/addFav', async (toolId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await toolService.addToFavourites(toolId, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Remove from favourites
export const removeFavourite = createAsyncThunk('tools/removeFav', async (toolId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    await toolService.removeFromFavourites(toolId, token);
    return toolId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const toolSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    resetToolState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearTool: (state) => { state.tool = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetchTools
      .addCase(fetchTools.pending,    (state) => { state.isLoading = true; })
      .addCase(fetchTools.fulfilled,  (state, action) => {
        state.isLoading = false;
        state.tools = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTools.rejected,   (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // fetchToolById
      .addCase(fetchToolById.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchToolById.fulfilled, (state, action) => { state.isLoading = false; state.tool = action.payload; })
      .addCase(fetchToolById.rejected,  (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // categories
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
      // submit
      .addCase(submitTool.pending,   (state) => { state.isLoading = true; })
      .addCase(submitTool.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.message = 'Tool submitted for review!'; })
      .addCase(submitTool.rejected,  (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // mySubmissions
      .addCase(fetchMySubmissions.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchMySubmissions.fulfilled, (state, action) => { state.isLoading = false; state.mySubmissions = action.payload; })
      .addCase(fetchMySubmissions.rejected,  (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // myFavourites
      .addCase(fetchMyFavourites.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchMyFavourites.fulfilled, (state, action) => { state.isLoading = false; state.myFavourites = action.payload; })
      .addCase(fetchMyFavourites.rejected,  (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // removeFavourite
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.myFavourites = state.myFavourites.filter(t => t._id !== action.payload);
      });
  },
});

export const { resetToolState, clearTool } = toolSlice.actions;
export default toolSlice.reducer;

