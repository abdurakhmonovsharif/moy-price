import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../../../Config/Api.js'
import {universalToast} from '../../../../Components/ToastMessages/ToastMessages.js'

export const sendingOrderProducts = createAsyncThunk(
    'registerIncomingOrders/sendingOrderProducts',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/connections/sendingproucts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateOrder = createAsyncThunk(
    'registerIncomingOrders/updateOrder',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/connections/updateorder', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const registerOrdersSlice = createSlice({
    name: 'registerIncomingOrders',
    initialState: {
        allProductsPartner: [],
        categoriesPartner: [],
        lastOrder: null,
        loading: false,
    },
    reducers: {
        setAllProductsPartner: (state, {payload}) => {
            state.allProductsPartner = [...payload]
        },
        setCategoriesPartner: (state, {payload}) => {
            state.categoriesPartner = [...payload]
        },
    },
    extraReducers: {
        [sendingOrderProducts.pending]: (state) => {
            state.loading = true
        },
        [sendingOrderProducts.fulfilled]: (state, {payload}) => {
            state.lastOrder = payload
            state.loading = false
        },
        [sendingOrderProducts.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loading = false
        },
    },
})

export const {setAllProductsPartner, setCategoriesPartner} =
    registerOrdersSlice.actions
export default registerOrdersSlice.reducer
