import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'

export const getUnits = createAsyncThunk(
    'units/getUnits',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('products/unit/getall', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addUnit = createAsyncThunk(
    'units/register',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('products/unit/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateUnit = createAsyncThunk(
    'unit/update',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('products/unit/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteUnit = createAsyncThunk(
    'units/delete',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('products/unit/delete', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const unitsSlice = createSlice({
    name: 'units',
    initialState: {
        units: [],
        loading: false,
        errorUnits: null,
        successAddUnit: false,
        successUpdateUnit: false,
        successDeleteUnit: false
    },
    reducers: {
        clearErrorUnits: (state) => {
            state.errorUnits = null
        },
        clearSuccessAddUnit: (state) => {
            state.successAddUnit = false
        },
        clearSuccessUpdateUnit: (state) => {
            state.successUpdateUnit = false
        },
        clearSuccessDeleteUnit: (state) => {
            state.successDeleteUnit = false
        }
    },
    extraReducers: {
        [getUnits.pending]: (state) => {
            state.loading = true
        },
        [getUnits.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.units = payload
        },
        [getUnits.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorUnits = payload
            universalToast(payload, 'error')
        },
        [addUnit.pending]: (state) => {
            state.loading = true
        },
        [addUnit.fulfilled]: (state, {payload}) => {
            state.units.unshift(payload)
            state.loading = false
            state.successAddUnit = true
        },
        [addUnit.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorUnits = payload
        },
        [updateUnit.pending]: (state) => {
            state.loading = true
        },
        [updateUnit.fulfilled]: (state, {payload}) => {
            state.units = payload
            state.loading = false
            state.successUpdateUnit = true
        },
        [updateUnit.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorUnits = payload
        },
        [deleteUnit.pending]: (state) => {
            state.loading = true
        },
        [deleteUnit.fulfilled]: (state, {payload}) => {
            state.units = payload
            state.loading = false
            state.successDeleteUnit = true
        },
        [deleteUnit.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorUnits = payload
        }
    }
})

export const {
    clearErrorUnits,
    clearSuccessAddUnit,
    clearSuccessUpdateUnit,
    clearSuccessDeleteUnit
} = unitsSlice.actions
export default unitsSlice.reducer
