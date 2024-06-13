import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'

export const getClients = createAsyncThunk(
    'clients/getClients',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/client/getclients', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getClientsSales = createAsyncThunk(
    'clients/getClientsSales',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/client/getclientssales', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)


export const getAllPackmans = createAsyncThunk(
    'packmans/getAllPackmans',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/packman/getall', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addClients = createAsyncThunk(
    'clients/addClients',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/client/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateClients = createAsyncThunk(
    'clients/updateClients',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/sales/client/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteClients = createAsyncThunk(
    'clients/deleteClients',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/sales/client/delete', {
                data: body,
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getClientsByFilter = createAsyncThunk(
    'clients/getClientsByFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/client/getclients', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const payClientSalesDebt = createAsyncThunk(
    'clients/payDebt',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/client/paymentDebt', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const clientsSlice = createSlice({
    name: 'clients',
    initialState: {
        packmans: [],
        clients: [],
        clients_info: [],
        total: 0,
        searchedClients: [],
        totalSearched: 0,
        loading: false,
        errorClients: null,
    },
    reducers: {
        clearSearchedClients: (state) => {
            state.totalSearched = 0
            state.searchedClients = []
        },
    },
    extraReducers: {
        [getClients.pending]: (state) => {
            state.loading = true
        },
        [getClients.fulfilled]: (state, {payload: {clients, count}}) => {
            console.log(clients)
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedClients = clients
                state.totalSearched = count
            } else {
                state.clients = clients
                state.total = count
            }
        },
        [getClients.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorClients = payload
            universalToast(payload, 'error')
        },
        [getClientsSales.pending]: (state) => {
            state.loading = true
        },
        [getClientsSales.fulfilled]: (state, {payload: {data}}) => {
            state.loading = false
            state.clients_info = data
        },
        [getClientsSales.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorClients = payload
            universalToast(payload, 'error')
        },
        [getAllPackmans.pending]: (state) => {
            state.loading = true
        },
        [getAllPackmans.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.packmans = payload
        },
        [getAllPackmans.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorClients = payload
            universalToast(payload, 'error')
        },
        [getClientsByFilter.pending]: (state) => {
            state.loading = true
        },
        [getClientsByFilter.fulfilled]: (
            state,
            {payload: {clients, count}}
        ) => {
            state.loading = false
            state.searchedClients = clients
            state.totalSearched = count
        },
        [getClientsByFilter.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorClients = payload
            universalToast(payload, 'error')
        },
        [addClients.pending]: (state) => {
            state.loading = true
        },
        [addClients.fulfilled]: (state, {payload: {clients, count}}) => {
            state.loading = false
            state.successAddClients = true
            state.searchedClients.length
                ? (state.searchedClients = clients)
                : (state.clients = clients)
            state.searchedClients.length
                ? (state.totalSearcheds = count)
                : (state.total = count)
        },
        [addClients.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorClients = payload
            universalToast(payload, 'error')
        },
        [updateClients.pending]: (state) => {
            state.loading = true
        },
        [updateClients.fulfilled]: (state, {payload: {clients, count}}) => {
            state.loading = false
            if (state.searchedClients.length > 0) {
                state.searchedClients = clients
                state.totalSearched = count
            } else {
                state.clients = clients
                state.total = count
            }
        },
        [updateClients.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorClients = payload
            universalToast(payload, 'error')
        },
        [deleteClients.pending]: (state) => {
            state.loading = true
        },
        [deleteClients.fulfilled]: (state, {payload: {clients, count}}) => {
            state.loading = false
            if (state.totalSearched > 0) {
                state.searchedClients = clients
                state.totalSearched = count
            } else {
                state.clients = clients
                state.total = count
            }
        },
        [deleteClients.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorClients = payload
            universalToast(payload, 'error')
        },
    },
})

export const {clearSearchedClients} = clientsSlice.actions
export default clientsSlice.reducer
