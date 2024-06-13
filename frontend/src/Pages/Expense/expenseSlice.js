import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import Api from '../../Config/Api'

export const getExpense = createAsyncThunk(
    'expense/getExpense',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/expense/get', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const registerExpense = createAsyncThunk(
    'expense/registerExpense',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/expense/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteExpense = createAsyncThunk(
    'expense/deleteExpense',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.delete('/expense/delete', {
                data: body,
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const expenseSlice = createSlice({
    name: 'expense',
    initialState: {
        expenses: [],
        count: 1,
        loading: false,
        successRegister: false,
    },
    reducers: {
        clearSuccessRegister: (state) => {
            state.successRegister = false
        },
    },
    extraReducers: {
        [getExpense.pending]: (state) => {
            state.loading = true
        },
        [getExpense.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getExpense.fulfilled]: (state, {payload: {expenses, count}}) => {
            state.loading = false
            state.expenses = expenses
            state.count = count
        },
        [registerExpense.pending]: (state) => {
            state.loading = true
        },
        [registerExpense.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [registerExpense.fulfilled]: (state, {payload: {expenses, count}}) => {
            state.loading = false
            state.expenses = expenses
            state.count = count
            state.successRegister = true
            universalToast('Xarajat yaratildi!', 'success')
        },
        [deleteExpense.pending]: (state) => {
            state.loading = true
        },
        [deleteExpense.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [deleteExpense.fulfilled]: (state, {payload: {expenses, count}}) => {
            state.loading = false
            state.expenses = expenses
            state.count = count
            universalToast('Xarajat ochirildi!', 'success')
        },
    },
})
export const {clearSuccessRegister} = expenseSlice.actions
export default expenseSlice.reducer
