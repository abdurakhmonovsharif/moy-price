import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'

export const getInventories = createAsyncThunk(
    'inventories/getInventories',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/inventory/getproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getInventoriesByFilter = createAsyncThunk(
    'inventories/getInventoriesByFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/inventory/getproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateInventory = createAsyncThunk(
    'inventories/updateInventory',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/inventory/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const complateInventory = createAsyncThunk(
    'inventories/complatedInventory',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/inventory/completed', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const inventorySlice = createSlice({
    name: 'inventories',
    initialState: {
        inventories: [],
        searchedInventories: [],
        total: 0,
        totalSearched: 0,
        loading: false,
        errorInventories: null,
        successUpdateInventory: false,
        successComplateInventory: false,
    },
    reducers: {
        clearErrorInventories: (state) => {
            state.errorInventories = null
        },
        clearSuccessUpdateInventory: (state) => {
            state.successUpdateInventory = false
        },
        clearSearchedInventories: (state) => {
            state.searchedInventories = []
            state.totalSearched = 0
        },
        clearCompleteSuccessInventory: (state) => {
            state.successComplateInventory = false
        },
    },
    extraReducers: {
        [getInventories.pending]: (state) => {
            state.loading = true
        },
        [getInventories.fulfilled]: (state, {payload: {products, count}}) => {
            state.loading = false
            state.searchedInventories.length
                ? (state.searchedInventories = products)
                : (state.inventories = products)
            state.searchedInventories.length
                ? (state.totalSearched = count)
                : (state.total = count)
        },
        [getInventories.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorInventories = payload
        },
        [getInventoriesByFilter.pending]: (state) => {
            state.loading = true
        },
        [getInventoriesByFilter.fulfilled]: (
            state,
            {payload: {products, count}}
        ) => {
            state.loading = false
            state.searchedInventories = products
            state.totalSearched = count
        },
        [getInventoriesByFilter.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorInventories = payload
        },

        [updateInventory.pending]: (state) => {
            state.loading = true
        },
        [updateInventory.fulfilled]: (state, {payload: {products, count}}) => {
            state.loading = false
            state.searchedInventories.length
                ? (state.searchedInventories = products)
                : (state.inventories = products)
            state.searchedInventories.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.successUpdateInventory = true
        },
        [updateInventory.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorInventories = payload
        },

        [complateInventory.pending]: (state) => {
            state.loading = true
        },
        [complateInventory.fulfilled]: (
            state,
            {payload: {products, count}}
        ) => {
            state.loading = false
            state.inventories = []
            state.total = 0
            state.searchedInventories = []
            state.totalSearched = 0
            state.successComplateInventory = true
        },
        [complateInventory.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorInventories = payload
        },
    },
})

export const {
    clearErrorInventories,
    clearSuccessUpdateInventory,
    clearSearchedInventories,
    clearCompleteSuccessInventory,
} = inventorySlice.actions
export default inventorySlice.reducer
