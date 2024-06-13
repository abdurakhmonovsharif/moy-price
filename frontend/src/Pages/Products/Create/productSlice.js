import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../../Config/Api'
import {
    successAddProductMessage,
    successDeleteProductMessage,
    successUpdateProductMessage,
    universalToast
} from '../../../Components/ToastMessages/ToastMessages.js'

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/getproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getIncomeProducts = createAsyncThunk(
    'products/getProducts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/filials/getincomeproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProductsAll = createAsyncThunk(
    'products/getexceldata',
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
    'products/getProductsByFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/getproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/products/product/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/products/product/delete', {
                data: body,
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addProductsFromExcel = createAsyncThunk(
    'products/addProductsFromExcel',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/registerall', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getCodeOfCategory = createAsyncThunk(
    'products/getCodeOfCategory',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/productcode', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const productSlice = createSlice({
    name: 'products',
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
        [getIncomeProducts.pending]: (state) => {
            state.loading = true
        },
        [getIncomeProducts.fulfilled]: (state, {payload: {products, count}}) => {
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedProducts = products
                state.totalSearched = count
            } else {
                state.products = products
                state.total = count
            }
        },
        [getIncomeProducts.rejected]: (state, {payload}) => {
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
        [addProduct.pending]: (state) => {
            state.loading = true
        },
        [addProduct.fulfilled]: (state, {payload: {products, count}}) => {
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedProducts = products
                state.totalSearched = count
            } else {
                state.products = products
                state.total = count
            }
            successAddProductMessage()
        },
        [addProduct.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorProducts = payload
            universalToast(payload, 'error')
        },
        [updateProduct.pending]: (state) => {
            state.loading = true
        },
        [updateProduct.fulfilled]: (state, {payload: {products, count}}) => {
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedProducts = products
                state.totalSearched = count
            } else {
                state.products = products
                state.total = count
            }
            successUpdateProductMessage()
        },
        [updateProduct.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorProducts = payload
            universalToast(payload, 'error')
        },
        [deleteProduct.pending]: (state) => {
            state.loading = true
        },
        [deleteProduct.fulfilled]: (state, {payload: {products, count}}) => {
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedProducts = products
                state.totalSearched = count
            } else {
                state.products = products
                state.total = count
            }
            successDeleteProductMessage()
        },
        [deleteProduct.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorProducts = payload
            universalToast(payload, 'error')
        },
        [addProductsFromExcel.pending]: (state) => {
            state.loading = true
        },
        [addProductsFromExcel.fulfilled]: (
            state,
            {payload: {products, count}}
        ) => {
            state.loading = false
            state.products = products
            state.total = count
            successAddProductMessage()
        },
        [addProductsFromExcel.rejected]: (state, {payload}) => {
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
        [getCodeOfCategory.pending]: (state) => {
            state.loading = true
        },
        [getCodeOfCategory.fulfilled]: (state, {payload: {code}}) => {
            state.loading = false
            state.lastProductCode = code
        },
        [getCodeOfCategory.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorProducts = payload
            universalToast(payload, 'error')
        },
    },
})

export const {clearSearchedProducts} = productSlice.actions
export default productSlice.reducer
