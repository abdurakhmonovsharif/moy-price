import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'

export const getFilialIdProducts = createAsyncThunk(
    'filialExchanges/getFilialIdProducts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/filials/getproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getExchangesFilter = createAsyncThunk(
    'filialExchanges/getExchangesFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/filials/getproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const ProductIdExchangesSlice = createSlice({
    name: 'filialExchanges',
    initialState: {
        idProducts: [],
        loading: false,
        errorShops: null,
        total: 0,
        totalSearched: 0,
        searchedExchanges: [],
    },
    reducers: {
        clearErrorShops: (state) => {
            state.errorShops = null
        },
        clearSearchedExchanges: (state) => {
            state.searchedExchanges = []
            state.totalSearched = 0
        },
    },
    extraReducers: {
        [getFilialIdProducts.pending]: (state) => {
            state.loading = true
        },
        [getFilialIdProducts.fulfilled]: (state, {payload: {count, data}}) => {
            state.loading = false
            state.searchedExchanges.length
                ? (state.searchedExchanges = data)
                : (state.idProducts = data)
            state.searchedExchanges.length
                ? (state.totalSearched = count)
                : (state.total = count)
        },
        [getFilialIdProducts.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorShops = payload
        },
        [getExchangesFilter.pending]: (state) => {
            state.loading = true
        },
        [getExchangesFilter.fulfilled]: (state, {payload: {count, data}}) => {
            state.loading = false
            state.searchedExchanges = data
            state.totalSearched = count
        },
        [getExchangesFilter.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorShops = payload
        },
    },
})

export const {clearErrorShops, clearSearchedExchanges} =
    ProductIdExchangesSlice.actions

export default ProductIdExchangesSlice.reducer
