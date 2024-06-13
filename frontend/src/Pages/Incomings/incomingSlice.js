import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {
    successPayDebt,
    universalToast,
} from '../../Components/ToastMessages/ToastMessages'
import Api from '../../Config/Api'

export const getAllSuppliers = createAsyncThunk(
    'incoming/getsuppliers',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/supplier/getincoming', {body})
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProducts = createAsyncThunk(
    'incoming/getproduct',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/getall', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addIncoming = createAsyncThunk(
    'incoming/register',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/products/incoming/registerall',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getTemporary = createAsyncThunk(
    'incoming/getTemporary',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/temporary/get', {body})
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addTemporary = createAsyncThunk(
    'incoming/temporary',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/temporary/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }   
    }
)

export const getIncomingConnectors = createAsyncThunk(
    'incoming/getConnectors',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/products/incoming/getconnectors',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getIncomings = createAsyncThunk(
    'incoming/getincomings',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/incoming/get', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteIncoming = createAsyncThunk(
    'incoming/deleteIncoming',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/products/incoming/delete', {
                data: body,
            })
            return {data, body}
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateIncoming = createAsyncThunk(
    'incoming/updateIncoming',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/products/incoming/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteTemporary = createAsyncThunk(
    'incoming/deleteTemporary',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/products/temporary/delete', {
                data: body,
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const excelIncomings = createAsyncThunk(
    'incoming/excelIncomings',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/incoming/getexcel', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const payDebt = createAsyncThunk(
    'incoming/makeDebt',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/incoming/payment', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const incomingSlice = createSlice({
    name: 'incoming',
    initialState: {
        allIncomingsData: [],
        suppliers: [],
        products: [],
        loading: false,
        error: null,
        incomingconnectors: [],
        incomings: [],
        incomingscount: 0,
        successUpdate: false,
        successAdd: false,
        successTemporary: false,
        successDelete: false,
        temporaries: [],
        temporary: {},
        searchedIncoming: [],
        loadingExcel: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearSuccessUpdate: (state) => {
            state.successUpdate = false
        },
        clearSuccessAdd: (state) => {
            state.successAdd = false
        },
        clearSuccessTemporary: (state) => {
            state.successTemporary = false
        },
        setTemporaryRegister: (
            state,
            {payload: {_id, incomings, supplier}}
        ) => {
            state.temporary = {
                _id,
                incomings,
                supplier,
            }
        },
        clearTemporary: (state) => {
            state.temporary = {}
        },
        clearSuccesDelete: (state) => {
            state.successDelete = false
        },
    },
    extraReducers: {
        [getAllSuppliers.pending]: (state) => {
            state.loading = true
        },
        [getAllSuppliers.fulfilled]: (state, {payload}) => {
            state.suppliers = payload
            state.loading = false
        },
        [getAllSuppliers.rejected]: (state, {payload}) => {
            state.error = payload
            state.loading = false
        },
        [getProducts.pending]: (state) => {
            state.loading = true
        },
        [getProducts.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.products = payload
        },
        [getProducts.rejected]: (state, {payload}) => {
            state.error = payload
        },
        [addIncoming.pending]: (state) => {
            state.loading = true
        },
        [addIncoming.fulfilled]: (state) => {
            state.loading = false
            state.successAdd = true
            universalToast('Mahsulotlar qabul qilindi!', 'success')
        },
        [addIncoming.rejected]: (state, {payload}) => {
            state.loading = false
            state.error = payload
            universalToast(`${payload}`, 'error')
        },
        [addTemporary.pending]: (state) => {
            state.loading = true
        },
        [addTemporary.fulfilled]: (state) => {
            state.loading = false
            state.successTemporary = true
            universalToast('Mahsulotlar saqlandi!', 'success')
        },
        [addTemporary.rejected]: (state, {payload}) => {
            state.loading = false
            state.error = payload
            universalToast(`${payload}`, 'error')
        },
        [getTemporary.pending]: (state) => {
            state.loading = true
        },
        [getTemporary.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.temporaries = payload
        },
        [getTemporary.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [deleteTemporary.pending]: (state) => {
            state.loading = true
        },
        [deleteTemporary.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.temporaries = payload
        },
        [deleteTemporary.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getIncomingConnectors.pending]: (state) => {
            state.loading = true
        },
        [getIncomingConnectors.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.incomingconnectors = payload
        },
        [getIncomingConnectors.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getIncomings.pending]: (state) => {
            state.loading = true
        },
        [getIncomings.fulfilled]: (state, {payload: {incomings, count}}) => {
            state.loading = false
            state.incomings = incomings
            state.incomingscount = count
        },
        [getIncomings.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [deleteIncoming.pending]: (state) => {
            state.loading = true
        },
        [deleteIncoming.fulfilled]: (state) => {
            state.loading = false
            state.successDelete = true
            universalToast("Mahsulot o'chirildi!", 'success')
        },
        [deleteIncoming.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [updateIncoming.pending]: (state) => {
            state.loading = true
        },
        [updateIncoming.fulfilled]: (state) => {
            state.loading = false
            state.successUpdate = true
            universalToast('Qabul mahsuloti yangilandi', 'success')
        },
        [updateIncoming.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [excelIncomings.pending]: (state) => {
            state.loadingExcel = true
        },
        [excelIncomings.fulfilled]: (state, {payload}) => {
            state.loadingExcel = false
            state.allIncomingsData = payload
        },
        [excelIncomings.rejected]: (state, {payload}) => {
            state.loadingExcel = false
            state.error = payload
        },
        [payDebt.pending]: (state) => {
            state.loading = true
        },
        [payDebt.fulfilled]: (state) => {
            state.loading = false
            successPayDebt()
        },
        [payDebt.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
    },
})

export const {
    clearSuccessUpdate,
    clearSuccessAdd,
    clearSuccessTemporary,
    setTemporaryRegister,
    clearTemporary,
    clearSuccesDelete,
} = incomingSlice.actions
export default incomingSlice.reducer
