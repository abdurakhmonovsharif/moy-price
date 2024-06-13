import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'
import {filter, map} from 'lodash'
import {
    successAddExchangeMessage,
    successDeleteExchangeMessage,
    successUpdateExchangeMessage,
    universalToast
} from '../../Components/ToastMessages/ToastMessages.js'

export const getCurrency = createAsyncThunk(
    'currency/getCurrency',
    async (body, {rejectWithValue}) => {
        try {
            const {
                data: {exchangerate},
            } = await Api.post('/exchangerate/get')
            return exchangerate
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getCurrencyType = createAsyncThunk(
    'currency/getCurrencyType',
    async (body, {rejectWithValue}) => {
        try {
            const {
                data: {currency},
            } = await Api.post('/exchangerate/currencyget')
            return currency
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const changeCurrencyType = createAsyncThunk(
    'currency/changeCurrencyType',
    async (body, {rejectWithValue}) => {
        try {
            const {
                data: {currency},
            } = await Api.put('/exchangerate/currencyupdate', body)
            return currency
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getCurrencies = createAsyncThunk(
    'currency/getCurrencies',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/exchangerate/getall', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addExchangerate = createAsyncThunk(
    'currency/addExchangerate',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/exchangerate/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const updateExchangerate = createAsyncThunk(
    'currency/updateExchangerate',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/exchangerate/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const deleteExchangerate = createAsyncThunk(
    'currency/deleteExchangerate',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/exchangerate/delete', {
                data: body,
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateProductPrices = createAsyncThunk(
    'currency/updateProductPrices',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/exchangerate/updateproductprices', {
                data: body,
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const initialState = {
    currency: null,
    currencies: [],
    currencyType: '',
    getCurrenciesLoading: true,
    getCurrencyLoading: true,
    currencyLoading: true,
    currencyError: null,
}

const currencySlice = createSlice({
    name: 'currency',
    initialState: initialState,
    reducers: {
        reset: () => initialState,
        clearError: (state) => {
            state.currencyError = null
        },
    },
    extraReducers: {
        [getCurrency.pending]: (state) => {
            state.getCurrencyLoading = true
        },
        [getCurrency.fulfilled]: (state, action) => {
            state.getCurrencyLoading = false
            state.currency = action.payload || null
        },
        [getCurrency.rejected]: (state, action) => {
            state.currencyLoading = false
            state.currencyError = action.payload
        },
        [getCurrencyType.pending]: (state) => {
            state.currencyLoading = true
        },
        [getCurrencyType.fulfilled]: (state, action) => {
            state.currencyLoading = false
            state.currencyType = action.payload
        },
        [getCurrencyType.rejected]: (state, action) => {
            state.currencyLoading = false
            state.currencyError = action.payload
        },
        [changeCurrencyType.pending]: (state) => {
            state.currencyLoading = true
        },
        [changeCurrencyType.fulfilled]: (state, action) => {
            state.currencyLoading = false
            state.currencyType = action.payload
        },
        [changeCurrencyType.rejected]: (state, action) => {
            state.currencyLoading = false
            state.currencyError = action.payload
        },
        [getCurrencies.pending]: (state) => {
            state.getCurrenciesLoading = true
        },
        [getCurrencies.fulfilled]: (state, action) => {
            state.getCurrenciesLoading = false
            state.currencies = action.payload
        },
        [getCurrencies.rejected]: (state, action) => {
            state.getCurrenciesLoading = false
            universalToast(action.payload, 'error')
        },
        [addExchangerate.pending]: (state) => {
            state.loading = true
        },
        [addExchangerate.fulfilled]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            state.currencies.unshift(payload)
            successAddExchangeMessage()
        },
        [addExchangerate.rejected]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            universalToast(payload, 'error')
        },
        [updateExchangerate.pending]: (state) => {
            state.getCurrenciesLoading = true
        },
        [updateExchangerate.fulfilled]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            state.currencies = map(state.currencies, (item) => {
                if (item._id === payload._id) {
                    return payload
                }
                return item
            })
            successUpdateExchangeMessage()
        },
        [updateExchangerate.rejected]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            universalToast(payload, 'error')
        },
        [deleteExchangerate.pending]: (state) => {
            state.getCurrenciesLoading = true
        },
        [deleteExchangerate.fulfilled]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            state.currencies = filter(
                state.currencies,
                (item) => item._id !== payload._id
            )
            successDeleteExchangeMessage()
        },
        [deleteExchangerate.rejected]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            universalToast(payload, 'error')
        },
        [updateProductPrices.pending]: (state) => {
            state.getCurrenciesLoading = true
        },
        [updateProductPrices.fulfilled]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            universalToast(payload.message, 'success')
        },
        [updateProductPrices.rejected]: (state, {payload}) => {
            state.getCurrenciesLoading = false
            universalToast(payload, 'error')
        },
    },
})

export const {clearError, reset} = currencySlice.actions
export default currencySlice.reducer
