import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import Api from '../../Config/Api'

export const getSuppliers = createAsyncThunk(
    'suppliers/getSuppliers',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('supplier/getsuppliers', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addSupplier = createAsyncThunk(
    'suppliers/register',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('supplier/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateSupplier = createAsyncThunk(
    'supplier/update',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('supplier/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteSupplier = createAsyncThunk(
    'suppliers/delete',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('supplier/delete', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getSuppliersByFilter = createAsyncThunk(
    'suppliers/getSuppliersByFilter',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('supplier/getsuppliers', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getIncomingConnectorsBySupplier = createAsyncThunk(
    'suppliers/getIncomingConnectorsBySupplier',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('supplier/incomingsreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const suppliersSlice = createSlice({
    name: 'suppliers',
    initialState: {
        suppliers: [],
        total: 0,
        searchedSuppliers: [],
        totalSearched: 0,
        incomingconnectors: [],
        connectorscount: 0,
        loading: false,
        errorSuppliers: null,
        successAddSupplier: false,
        successUpdateSupplier: false,
        successDeleteSupplier: false,
    },
    reducers: {
        clearErrorSuppliers: (state) => {
            state.errorSuppliers = null
        },
        clearSuccessAddSupplier: (state) => {
            state.successAddSupplier = false
        },
        clearSuccessUpdateSupplier: (state) => {
            state.successUpdateSupplier = false
        },
        clearSuccessDeleteSupplier: (state) => {
            state.successDeleteSupplier = false
        },
        clearSearchedSuppliers: (state) => {
            state.searchedSuppliers = []
            state.totalSearched = 0
        },
    },
    extraReducers: {
        [getSuppliers.pending]: (state) => {
            state.loading = true
        },
        [getSuppliers.fulfilled]: (state, {payload: {suppliers, count}}) => {
            state.loading = false
            state.searchedSuppliers.length
                ? (state.searchedSuppliers = suppliers)
                : (state.suppliers = suppliers)
            state.searchedSuppliers.length
                ? (state.totalSearched = count)
                : (state.total = count)
        },
        [getSuppliers.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSuppliers = payload
        },
        [getSuppliersByFilter.pending]: (state) => {
            state.loading = true
        },
        [getSuppliersByFilter.fulfilled]: (
            state,
            {payload: {suppliers, count}}
        ) => {
            state.loading = false
            state.searchedSuppliers = suppliers
            state.totalSearched = count
        },
        [getSuppliersByFilter.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSuppliers = payload
        },
        [addSupplier.pending]: (state) => {
            state.loading = true
        },
        [addSupplier.fulfilled]: (state, {payload: {suppliers, count}}) => {
            state.loading = false
            state.successAddSupplier = true
            state.searchedSuppliers.length
                ? (state.searchedSuppliers = suppliers)
                : (state.suppliers = suppliers)
            state.searchedSuppliers.length
                ? (state.totalSearched = count)
                : (state.total = count)
        },
        [addSupplier.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSuppliers = payload
        },
        [updateSupplier.pending]: (state) => {
            state.loading = true
        },
        [updateSupplier.fulfilled]: (state, {payload: {suppliers, count}}) => {
            state.searchedSuppliers.length
                ? (state.searchedSuppliers = suppliers)
                : (state.suppliers = suppliers)
            state.searchedSuppliers.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.loading = false
            state.successUpdateSupplier = true
        },
        [updateSupplier.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSuppliers = payload
        },
        [deleteSupplier.pending]: (state) => {
            state.loading = true
        },
        [deleteSupplier.fulfilled]: (state, {payload: {suppliers, count}}) => {
            state.searchedSuppliers.length
                ? (state.searchedSuppliers = suppliers)
                : (state.suppliers = suppliers)
            state.searchedSuppliers.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.loading = false
            state.successDeleteSupplier = true
        },
        [deleteSupplier.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorSuppliers = payload
        },
        [getIncomingConnectorsBySupplier.pending]: (state) => {
            state.loading = true
        },
        [getIncomingConnectorsBySupplier.fulfilled]: (
            state,
            {payload: {data, count}}
        ) => {
            state.pending = false
            state.incomingconnectors = data
            state.connectorscount = count
        },
        [getIncomingConnectorsBySupplier.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
    },
})

export const {
    clearErrorSuppliers,
    clearSuccessAddSupplier,
    clearSuccessUpdateSupplier,
    clearSuccessDeleteSupplier,
    clearSearchedSuppliers,
} = suppliersSlice.actions
export default suppliersSlice.reducer
