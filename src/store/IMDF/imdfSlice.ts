import { createReducer, createSlice, PayloadAction } from '@reduxjs/toolkit'


export type IMDFData = {
    byType: {},
    byId: {},

}

const initialState: IMDFData = {
    byType: {},
    byId: {},
}

const imdfSlice = createSlice({
    name: 'imdf',
    initialState,
    reducers: {
        dataReceived: (state, action: PayloadAction<IMDFData>) => {
            state.byId = action.payload.byId;
            state.byType = action.payload.byType;
        }
    },
})

export const { dataReceived } = imdfSlice.actions;

export default imdfSlice.reducer;
// export default createReducer(initialState, (builder) =>
//     builder
//         .addCase(IMDF_GET_ALL, (state, action) => {
//             state.byType = action.payload.byType;
//             state.byId = action.payload.byId;
//         })
// )