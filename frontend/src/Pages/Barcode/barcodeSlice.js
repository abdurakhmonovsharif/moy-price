import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'
import {
    successAddBarcodeMessage,
    successDeleteBarcodeMessage,
    successRegisterAllBarcodesMessage,
    successUpdateBarcodeMessage,
    universalToast
} from '../../Components/ToastMessages/ToastMessages.js'

export const getBarcode = createAsyncThunk('barcode/getBarcodeByCode', async (body, {rejectWithValue}) => {
    try {
        const {data} = await Api.post('/barcode/getbycode', body)
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getAllProductsWithBarcode = createAsyncThunk('barcode/getAllProductsWithBarcode', async (body, {rejectWithValue}) => {
    try {
        const {data} = await Api.post('/barcode/getall', body)
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const addBarcode = createAsyncThunk('barcode/addBarcode', async (body, {rejectWithValue}) => {
    try {
        const {data} = await Api.post('/barcode/register', body)
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})
export const updateBarcode = createAsyncThunk('barcode/updateBarcode', async (body, {rejectWithValue}) => {
    try {
        const {data} = await Api.put('/barcode/update', body)
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getBarcodeByFilter = createAsyncThunk('barcode/getBarcodeByFilter', async (body, {rejectWithValue}) => {
    try {
        const {data} = await Api.post('/barcode/getall', body)
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const registerAllBarcode = createAsyncThunk('barcode/registerAllBarcode', async (body, {rejectWithValue}) => {
    try {
        const {data} = await Api.post('/barcode/registerall', body)
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteBarCode = createAsyncThunk('barcode/deleteBarCode', async (body, {rejectWithValue}) => {
    try {
        const {data} = await Api.delete('/barcode/delete', {data: body})
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

const barcodeSlice = createSlice({
    name: 'barcode', initialState: {
        barcode: '',
        products: [],
        total: 0,
        searchedProducts: [],
        totalSearched: 0,
        errorGetBarcode: false,
        successGetBarcode: false,
        loading: false,
        loadingGetAll: true,
        loadingAdd: false,
        errorGetAll: null,
        errorAddProduct: false
    }, reducers: {
        clearErrorGetBarcode: (state) => {
            state.errorGetBarcode = false
        }, clearSearchedProducts: (state) => {
            state.searchedProducts = []
            state.totalSearched = 0
        }
    }, extraReducers: {
        [getBarcode.pending]: (state) => {
            state.loading = true
        }, [getBarcode.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.barcode = payload
        }, [getBarcode.rejected]: (state) => {
            state.loading = false
            state.barcode = ''
            state.errorGetBarcode = true
        }, [getAllProductsWithBarcode.pending]: (state) => {
            state.loadingGetAll = true
        }, [getAllProductsWithBarcode.fulfilled]: (state, {payload: {barcodes, count}}) => {
            state.loadingGetAll = false
            if (state.searchedProducts.length > 0) {
                state.searchedProducts = barcodes
                state.totalSearched = count
            } else {
                state.products = barcodes
                state.total = count
            }
        }, [getAllProductsWithBarcode.rejected]: (state, {payload}) => {
            state.loadingGetAll = false
            state.errorGetAll = payload
            universalToast(payload, 'error', {
                autoClose: 2000
            })
        }, [addBarcode.pending]: (state) => {
            state.loadingAdd = true
        }, [addBarcode.fulfilled]: (state, {payload: {barcodes, count}}) => {
            state.loadingAdd = false
            state.products = barcodes
            state.total = count
            successAddBarcodeMessage()
        }, [addBarcode.rejected]: (state, {payload}) => {
            state.loadingAdd = false
            state.errorAddProduct = payload
            universalToast(payload, 'error', {
                autoClose: 2000
            })
        }, [updateBarcode.fulfilled]: (state, {payload: {barcodes, count}}) => {
            state.products = barcodes
            state.total = count
            successUpdateBarcodeMessage()
        }, [updateBarcode.rejected]: (state, {payload}) => {
            universalToast(payload, 'error', {
                autoClose: 2000
            })
        }, [deleteBarCode.fulfilled]: (state, {payload: {barcodes, count}}) => {
            state.products = barcodes
            state.total = count
            successDeleteBarcodeMessage()
        }, [deleteBarCode.rejected]: (state, {payload}) => {
            universalToast(payload, 'error', {
                autoClose: 2000
            })
        }, [getBarcodeByFilter.pending]: (state) => {
            state.loading = true
        }, [getBarcodeByFilter.fulfilled]: (state, {payload: {barcodes, count}}) => {
            state.loading = false
            state.searchedProducts = barcodes
            state.totalSearched = count
        }, [getBarcodeByFilter.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error', {
                autoClose: 2000
            })
        },
        [registerAllBarcode.fulfilled]: (state, {payload: {barcodes, count}}) => {
            state.products = barcodes
            state.total = count
            successRegisterAllBarcodesMessage()
        },
        [registerAllBarcode.rejected]: (state, {payload}) => {
            universalToast(payload, 'error', {
                autoClose: 2000
            })
        }
    }
})

export const {clearErrorGetBarcode, clearSearchedProducts} = barcodeSlice.actions
export default barcodeSlice.reducer
