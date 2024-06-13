import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../../Config/Api.js'
import {universalToast} from '../../../Components/ToastMessages/ToastMessages.js'

export const getSellings = createAsyncThunk(
    'sellings/getSellings',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/getconnectors',
                body
            )
            return data
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getSellingsByFilter = createAsyncThunk(
    'sellings/getSellingsByFilter',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/getconnectors',
                body
            )
            return data
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const addClient = createAsyncThunk(
    'sellings/addClient',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/saleproducts/addclient', body)
            return data
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)
export const deleteSaleConnector = createAsyncThunk(
    'sellings/deleteConnector',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/sales/saleproducts/delete', {
                data: body,
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const excelAllSellings = createAsyncThunk(
    'sellings/excelAllSellings',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/sales/saleproducts/getconnectorsexcel',
                body
            )
            return data
        } catch (error) {
            rejectWithValue(error)
        }
    }
)

const sellingsSlice = createSlice({
    name: 'sellings',
    initialState: {
        excelAllData: [],
        sellings: [],
        total: 0,
        totalSearched: 0,
        searchedSellings: [],
        getSellingsLoading: true,
        getSellingsError: null,
    },
    reducers: {
        clearSearchedSellings: (state) => {
            state.searchedSellings = []
            state.totalSearched = 0
        },
    },
    extraReducers: {
        [getSellings.pending]: (state) => {
            state.getSellingsLoading = true
        },
        [getSellings.fulfilled]: (
            state,
            {payload: {saleconnectors, count}}
        ) => {
            state.getSellingsLoading = false
            state.searchedSellings.length
                ? (state.searchedSellings = saleconnectors)
                : (state.sellings = saleconnectors)
            state.searchedSellings.length
                ? (state.totalSearched = count)
                : (state.total = count)
        },
        [getSellings.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.getSellingsError = payload
            state.getSellingsLoading = false
            state.getSellingsError = null
        },
        [getSellingsByFilter.pending]: (state) => {
            state.getSellingsLoading = true
        },
        [getSellingsByFilter.fulfilled]: (
            state,
            {payload: {saleconnectors, count}}
        ) => {
            state.getSellingsLoading = false
            state.searchedSellings = saleconnectors
            state.totalSearched = count
        },
        [getSellingsByFilter.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.getSellingsError = payload
            state.getSellingsLoading = false
            state.getSellingsError = null
        },
        [excelAllSellings.pending]: (state) => {
            state.getSellingsLoading = true
        },
        [excelAllSellings.fulfilled]: (state, {payload}) => {
            state.getSellingsLoading = false
            if (payload && payload.saleconnectors) {
                state.excelAllData = payload.saleconnectors
            }
        },
        [excelAllSellings.rejected]: (state, {payload}) => {
            state.getSellingsLoading = false
            state.getSellingsError = payload
        },
        [addClient.pending]: (state) => {
            state.loading = true
        },
        [addClient.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
        [addClient.fulfilled]: (state) => {
            state.loading = false
            universalToast('Mijoz qushildi!', 'success')
        },
    },
})
export const {clearSearchedSellings} = sellingsSlice.actions
export default sellingsSlice.reducer
