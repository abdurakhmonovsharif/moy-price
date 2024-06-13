import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../../Config/Api'
import {universalToast} from '../../../Components/ToastMessages/ToastMessages.js'

export const getProducts = createAsyncThunk(
    'partnerproducts/getProducts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/products/product/getpartnerproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProductsAll = createAsyncThunk(
    'partnerproducts/getexceldata',
    async (
        body = {
            search: {
                name: '',
                code: '',
                category: '',
            },
        },
        {rejectWithValue}
    ) => {
        try {
            const {data} = await Api.post(
                '/products/product/getexceldata',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProductsByFilter = createAsyncThunk(
    'partnerproducts/getProductsByFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/products/product/getpartnerproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const partnerProductSlice = createSlice({
    name: 'partnerproducts',
    initialState: {
        products: [],
        lastProductCode: null,
        allProducts: [],
        searchedProducts: [],
        total: 0,
        totalSearched: 0,
        loading: false,
        errorProducts: null,
        loadingExcel: false,
    },
    reducers: {
        clearSearchedProducts: (state) => {
            state.searchedProducts = []
            state.totalSearched = 0
        },
        clearUploadExcel: (state) => {
            state.allProducts = []
        },
    },
    extraReducers: {
        [getProducts.pending]: (state) => {
            state.loading = true
        },
        [getProducts.fulfilled]: (state, {payload: {products, count}}) => {
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedProducts = products
                state.totalSearched = count
            } else {
                state.products = products
                state.total = count
            }
        },
        [getProducts.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorProducts = payload
            universalToast(payload, 'error')
        },
        [getProductsByFilter.pending]: (state) => {
            state.loading = true
        },
        [getProductsByFilter.fulfilled]: (
            state,
            {payload: {products, count}}
        ) => {
            state.loading = false
            state.searchedProducts = products
            state.totalSearched = count
        },
        [getProductsByFilter.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorProducts = payload
            universalToast(payload, 'error')
        },

        [getProductsAll.pending]: (state) => {
            state.loadingExcel = true
        },
        [getProductsAll.fulfilled]: (state, {payload}) => {
            state.loadingExcel = false
            state.allProducts = payload
        },
        [getProductsAll.rejected]: (state, {payload}) => {
            state.loadingExcel = false
            state.errorProducts = payload
            universalToast(payload, 'error')
        },
    },
})

export const {clearSearchedProducts} = partnerProductSlice.actions
export default partnerProductSlice.reducer
