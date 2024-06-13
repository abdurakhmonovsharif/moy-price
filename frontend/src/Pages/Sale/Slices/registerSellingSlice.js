import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../../Config/Api.js'
import {successSavedTemporary, universalToast} from '../../../Components/ToastMessages/ToastMessages.js'

export const getAllProducts = createAsyncThunk(
    'registerSelling/getAllProducts',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/getproductsale')
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const getProductNotArchive = createAsyncThunk(
    'registerSelling/getProductNotArchive',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/getProductsNotArchive')
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getClients = createAsyncThunk(
    'registerSelling/getClients',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/client/getall')
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const makePayment = createAsyncThunk(
    'registerSelling/makePayment',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/saleproducts/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const savePayment = createAsyncThunk(
    'registerSelling/saveTemporary',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/temporary/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addPayment = createAsyncThunk(
    'registerSelling/addProducts',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/addproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getFilials = createAsyncThunk(
    'registerSelling/getFilials',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/filials/filialsforsale/get', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const returnSaleProducts = createAsyncThunk(
    'registerSelling/returnSaleProducts',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/returnproducts',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getFilialProducts = createAsyncThunk(
    'registerSelling/getFilialsProducts',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/filials/products/get', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const registerSellingSlice = createSlice({
    name: 'registerSelling',
    initialState: {
        allProducts: [],
        clients: [],
        lastPayments: [],
        filials: [],
        filialProducts: [],
        loadingGetAllProducts: true,
        loadingGetClients: true,
        loadingMakePayment: false,
        loadingSavePayment: false,
        errorGetAllProducts: null,
        errorGetUsers: null,
        errorMakePayment: null,
        errorSavePayment: null,
    },
    reducers: {
        setAllProductsBySocket: (state, {payload}) => {
            state.allProducts = [...payload]
        },
    },
    extraReducers: {
        [getAllProducts.pending]: (state) => {
            state.loadingGetAllProducts = true
        },
        [getAllProducts.fulfilled]: (state, {payload}) => {
            state.loadingGetAllProducts = false
            // state.allProducts = payload
        },
        [getAllProducts.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingGetAllProducts = false
            state.errorGetAllProducts = payload
            state.errorGetAllProducts = null
        },
        [getClients.pending]: (state) => {
            state.loadingGetClients = true
        },
        [getClients.fulfilled]: (state, {payload}) => {
            state.loadingGetClients = false
            state.clients = payload
        },
        [getClients.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingGetClients = false
            state.errorGetUsers = payload
            state.errorGetUsers = null
        },
        [makePayment.pending]: (state) => {
            state.loadingMakePayment = true
        },
        [makePayment.fulfilled]: (state, {payload}) => {
            state.loadingMakePayment = false
            state.lastPayments.unshift(payload)
        },
        [makePayment.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingMakePayment = false
            state.errorMakePayment = payload
            state.errorMakePayment = null
        },
        [savePayment.pending]: (state) => {
            state.loadingSavePayment = true
        },
        [savePayment.fulfilled]: (state) => {
            state.loadingSavePayment = false
            successSavedTemporary()
        },
        [savePayment.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingSavePayment = false
            state.errorSavePayment = payload
            state.errorSavePayment = null
        },
        [addPayment.pending]: (state) => {
            state.loadingMakePayment = true
        },
        [addPayment.fulfilled]: (state, {payload}) => {
            state.loadingMakePayment = false
            state.lastPayments.unshift(payload)
        },
        [addPayment.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingMakePayment = false
            state.errorMakePayment = payload
        },
        [returnSaleProducts.pending]: (state) => {
            state.loadingMakePayment = true
        },
        [returnSaleProducts.fulfilled]: (state, {payload}) => {
            state.loadingMakePayment = false
            state.lastPayments.unshift(payload)
        },
        [returnSaleProducts.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingMakePayment = false
            state.errorMakePayment = payload
            state.errorMakePayment = null
        },
        [getFilials.pending]: (state) => {
            state.loading = true
        },
        [getFilials.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
        [getFilials.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.filials = [...payload.filials].map((filial) => ({
                label: filial.name,
                value: filial._id,
            }))
        },
        [getFilialProducts.pending]: (state) => {
            state.loading = true
        },
        [getFilialProducts.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
        [getFilialProducts.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.filialProducts = payload
        },
    },
})

export const {setAllProductsBySocket} = registerSellingSlice.actions
export default registerSellingSlice.reducer
