import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricsList = [];

const initialState = {
  metrics: [''],
  metricsSelected: [],
  currentTime: Date.now() - 1800000,
  selectedMeasurements: [],
  currentMeasurementValue: '',
};
const slice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    storeMetrics: (state, action: PayloadAction<MetricsList>) => {
      state.metrics = action.payload;
    },
    selectedMetrics: (state, action) => {
      state.metricsSelected = action.payload;
      state.currentTime = Date.now() - 1800000;
    },
    storeSelectedMeasurements: (state, action) => {
      state.selectedMeasurements = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
