import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'

export const getPackmans = createAsyncThunk(
    'packmans/getPackmans',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/packman/getpackmans', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addPackman = createAsyncThunk(
    'packmans/addPackman',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/packman/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updatePackman = createAsyncThunk(
    'packmans/updatePackman',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/sales/packman/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deletePackman = createAsyncThunk(
    'packmans/deletePacman',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/sales/packman/delete', {
                data: body
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getPackmansByFilter = createAsyncThunk(
    'packmans/getPackmansByFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/packman/getpackmans', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const packmansSlice = createSlice({
    name: 'packmans',
    initialState: {
        packmans: [],
        total: 0,
        searchedPackmans: [],
        totalSearched: 0,
        loading: false,
        errorPackmans: null,
        successAddPackman: false,
        successUpdatePackman: false,
        successDeletePackman: false
    },
    reducers: {
        clearErrorPackmans: (state) => {
            state.errorPackmans = null
        },
        clearSuccessAddPackmans: (state) => {
            state.successAddPackman = false
        },
        clearSuccessUpdatePackmans: (state) => {
            state.successUpdatePackman = false
        },
        clearSuccessDeletePackmans: (state) => {
            state.successDeletePackman = false
        },
        clearSearchedPackmans: (state) => {
            state.searchedPackmans = []
            state.totalSearched = 0
        }
    },
    extraReducers: {
        [getPackmans.pending]: (state) => {
            state.loading = true
        },
        [getPackmans.fulfilled]: (state, {payload: {packmans, count}}) => {
            state.loading = false
            state.searchedPackmans.length
                ? (state.searchedPackmans = packmans)
                : (state.packmans = packmans)
            state.searchedPackmans.length
                ? (state.totalSearched = count)
                : (state.total = count)
        },
        [getPackmans.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorPackmans = payload
        },
        [getPackmansByFilter.pending]: (state) => {
            state.loading = true
        },
        [getPackmansByFilter.fulfilled]: (
            state,
            {payload: {packmans, count}}
        ) => {
            state.loading = false
            state.searchedPackmans = packmans
            state.totalSearched = count
        },
        [getPackmansByFilter.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorPackmans = payload
        },
        [addPackman.pending]: (state) => {
            state.loading = true
        },
        [addPackman.fulfilled]: (state, {payload: {packmans, count}}) => {
            state.loading = false
            state.successAddPackman = true
            state.searchedPackmans.length
                ? (state.searchedPackmans = packmans)
                : (state.packmans = packmans)
            state.searchedPackmans.length
                ? (state.totalSearched = count)
                : (state.total = count)
        },
        [addPackman.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorPackmans = payload
        },
        [updatePackman.pending]: (state) => {
            state.loading = true
        },
        [updatePackman.fulfilled]: (state, {payload: {packmans, count}}) => {
            state.searchedPackmans.length
                ? (state.searchedPackmans = packmans)
                : (state.packmans = packmans)
            state.searchedPackmans.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.loading = false
            state.successUpdatePackman = true
        },
        [updatePackman.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorPackmans = payload
        },
        [deletePackman.pending]: (state) => {
            state.loading = true
        },
        [deletePackman.fulfilled]: (state, {payload: {packmans, count}}) => {
            state.searchedPackmans.length
                ? (state.searchedPackmans = packmans)
                : (state.packmans = packmans)
            state.searchedPackmans.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.loading = false
            state.successDeletePackman = true
        },
        [deletePackman.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorPackmans = payload
        }
    }
})

export const {
    clearErrorPackmans,
    clearSuccessAddPackmans,
    clearSuccessDeletePackmans,
    clearSuccessUpdatePackmans,
    clearSearchedPackmans
} = packmansSlice.actions
export default packmansSlice.reducer
