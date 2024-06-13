import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api.js'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'

export const getReportOfCategory = createAsyncThunk(
    'categoryReport/getReportOfCategory',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/product/productcategory', body)
            return data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const categoryReportSlice = createSlice({
    name: 'categoryReport',
    initialState: {
        products: [],
        loading: true,
        error: null
    },
    reducers: {},
    extraReducers: {
        [getReportOfCategory.fulfilled]: (state, action) => {
            state.products = action.payload
            state.loading = false
            state.error = null
        },
        [getReportOfCategory.pending]: (state) => {
            state.loading = true
        },
        [getReportOfCategory.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload
            universalToast(action.payload, 'error')
        }
    }
})

export default categoryReportSlice.reducer