import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../../../Config/Api.js'
import {universalToast} from '../../../../Components/ToastMessages/ToastMessages.js'

export const createTemporaryOrder = createAsyncThunk(
    'savedOrders/createTemporary',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/connections/createtemporary', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteSavedOrder = createAsyncThunk(
    'savedOrders/deleteSavedOrders',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/connections/deletetemporary', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getSavedOrders = createAsyncThunk(
    'savedOrders/getSavedOrders',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/connections/gettemporaries', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const savedOrdersSlice = createSlice({
    name: 'savedOrders',
    initialState: {
        savedOrders: [],
        getLoading: true,
        deleteLoading: false,
        deleteError: null,
        getError: null,
    },
    extraReducers: {
        [createTemporaryOrder.pending]: (state) => {
            state.getLoading = true
        },
        [createTemporaryOrder.fulfilled]: (state, {payload}) => {
            universalToast(payload.message, 'success')
            state.getLoading = false
        },
        [createTemporaryOrder.rejected]: (state, {payload}) => {
            universalToast(payload.message, 'error')
            state.getLoading = false
        },
        [getSavedOrders.pending]: (state) => {
            state.getLoading = true
        },
        [getSavedOrders.fulfilled]: (state, {payload}) => {
            state.getLoading = false
            state.savedOrders = payload
        },
        [getSavedOrders.rejected]: (state, {payload}) => {
            universalToast(payload.message, 'error')
            state.getLoading = false
        },
        [deleteSavedOrder.pending]: (state) => {
            state.deleteLoading = true
        },
        [deleteSavedOrder.fulfilled]: (state, {payload}) => {
            state.deleteLoading = false
            universalToast(payload.message, 'success')
        },
        [deleteSavedOrder.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.deleteLoading = false
            state.deleteError = payload
            state.deleteError = null
        },
    },
})

export default savedOrdersSlice.reducer
