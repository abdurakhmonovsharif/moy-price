import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../../../Config/Api.js'
import {universalToast} from '../../../../Components/ToastMessages/ToastMessages.js'

export const getOrders = createAsyncThunk(
    'ordersList/createOrder',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/connections/getorders', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getOrdersByFilter = createAsyncThunk(
    'ordersList/searchOrders',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/connections/getorders', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const ordersSlice = createSlice({
    name: 'ordersList',
    initialState: {
        orders: [],
        searchedOrders: [],
        count: 0,
        searchedTotal: 0,
        loading: false,
    },
    reducers: {
        clearSearchedOrders: (state) => {
            state.searchedOrders = []
            state.searchedTotal = 0
        },
    },
    extraReducers: {
        [getOrders.pending]: (state) => {
            state.loading = true
        },
        [getOrders.fulfilled]: (state, {payload: {orders, count}}) => {
            state.orders = orders
            state.count = count
            state.loading = false
        },
        [getOrders.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loading = false
        },
        [getOrdersByFilter.pending]: (state) => {
            state.loading = true
        },
        [getOrdersByFilter.fulfilled]: (state, {payload: {orders, count}}) => {
            state.searchedOrders = orders
            state.searchedTotal = count
            state.loading = false
        },
        [getOrdersByFilter.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loading = false
        },
    },
})

export const {clearSearchedOrders} = ordersSlice.actions
export default ordersSlice.reducer
