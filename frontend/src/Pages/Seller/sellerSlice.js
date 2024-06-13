import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import Api from '../../Config/Api'

export const getSellers = createAsyncThunk(
    'sellers/getSellers',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/user/getsellers', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const smsApiKey = createAsyncThunk(
    'sellers/smsApiKey',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/market/getsmsApiKey/create_update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const getsmsApiKey = createAsyncThunk(
    'sellers/getsmsApiKey',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/market/getsmsApiKey', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const addSeller = createAsyncThunk(
    'sellers/addSeller',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/user/createseller', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateSeller = createAsyncThunk(
    'sellers/updateSeller',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/user/createseller', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getSellerReports = createAsyncThunk(
    'sellers/getsellersreport',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/sellers/getreports', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const sellerSlice = createSlice({
    name: 'sellers',
    initialState: {
        sellers: [],
        user: '',
        loading: false,
        errorSellings: null,
        successAddSelling: false,
        successUpdateSelling: false,
        sellersreport: [],
        count: 0,
    },
    reducers: {
        clearErrorSellers: (state) => {
            state.errorSellings = null
        },
        clearSuccessAddSeller: (state) => {
            state.successAddSelling = false
        },
        clearSuccessUpdateSeller: (state) => {
            state.successUpdateSelling = false
        },
    },
    extraReducers: {
        [getSellers.pending]: (state) => {
            state.loading = true
        },
        [getSellers.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.sellers = payload
        },
        [getSellers.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSellings = payload
        },
        [addSeller.pending]: (state) => {
            state.loading = true
        },
        [addSeller.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.successAddSelling = true
            state.sellers = payload
        },
        [addSeller.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSellings = payload
        },
        [updateSeller.pending]: (state) => {
            state.loading = false
        },
        [updateSeller.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.successUpdateSelling = true
            state.sellers = payload
        },
        [updateSeller.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSellings = payload
        },
        [getSellerReports.pending]: (state) => {
            state.loading = true
        },
        [getSellerReports.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getSellerReports.fulfilled]: (
            state,
            {payload: {saleconnectors, count}}
        ) => {
            state.loading = false
            state.sellersreport = saleconnectors
            state.count = count
        },
    },
})

export const {
    clearErrorSellers,
    clearSuccessAddSeller,
    clearSuccessDeleteSeller,
    clearSuccessUpdateSeller,
} = sellerSlice.actions
export default sellerSlice.reducer
