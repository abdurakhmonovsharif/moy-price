import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api.js'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'

export const getProductReports = createAsyncThunk(
    'productReport/getProductReports',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/getreportproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProductReportsByFilter = createAsyncThunk(
    'productReport/getProductReportsByFilter',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/getreportproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getAllProductReports = createAsyncThunk(
    'productReport/getAllProductReports',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/getexcelreportproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getMinimumProducts = createAsyncThunk(
    'productReport/getMinimumProducts',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/products/product/getminimumproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const productreportSlice = createSlice({
    name: 'productreport',
    initialState: {
        loading: true,
        loadingExcel: false,
        error: null,
        products: [],
        searchedProducts: [],
        total: 0,
        totalSearched: 0,
        minimumproducts: [],
    },
    reducers: {
        clearSearchedProducts: (state) => {
            state.searchedProducts = []
            state.totalSearched = 0
        },
    },
    extraReducers: {
        [getProductReports.pending]: (state) => {
            state.loading = true
        },
        [getProductReports.fulfilled]: (
            state,
            {payload: {products, count}}
        ) => {
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedProducts = products
                state.totalSearched = count
            } else {
                state.products = products
                state.total = count
            }
        },
        [getProductReports.rejected]: (state, {payload}) => {
            state.loading = false
            state.error = payload
            universalToast(payload, 'error')
        },
        [getProductReportsByFilter.pending]: (state) => {
            state.loading = true
        },
        [getProductReportsByFilter.fulfilled]: (
            state,
            {payload: {products, count}}
        ) => {
            state.loading = false
            state.searchedProducts = products
            state.totalSearched = count
        },
        [getProductReportsByFilter.rejected]: (state, {payload}) => {
            state.loading = false
            state.error = payload
            universalToast(payload, 'error')
        },
        [getAllProductReports.pending]: (state) => {
            state.loadingExcel = true
        },
        [getAllProductReports.fulfilled]: (state) => {
            state.loadingExcel = false
        },
        [getAllProductReports.rejected]: (state, {payload}) => {
            state.loadingExcel = false
            universalToast(payload, 'error')
        },
        [getMinimumProducts.pending]: (state) => {
            state.loading = true
        },
        [getMinimumProducts.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.minimumproducts = payload
        },
        [getMinimumProducts.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
    },
})

export const {clearSearchedProducts} = productreportSlice.actions
export default productreportSlice.reducer
