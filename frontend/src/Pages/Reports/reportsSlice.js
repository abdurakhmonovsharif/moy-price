import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import Api from '../../Config/Api'

export const getReports = createAsyncThunk(
    'reports/getReports',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/getreports', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getSales = createAsyncThunk(
    'reports/getSales',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/getsalesreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProfit = createAsyncThunk(
    'reports/getProfit',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/profitreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getPaymentReport = createAsyncThunk(
    'reports/getPaymentReport',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/paymentsreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getDebts = createAsyncThunk(
    'reports/getDebts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/getdebtsreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getDiscounts = createAsyncThunk(
    'reports/getDsicounts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/getdiscountsreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const payDebt = createAsyncThunk(
    'reports/payDebt',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/sales/saleproducts/payment', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)


export const getBackProducts = createAsyncThunk(
    'reports/backProducts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/getbackproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getExpensesReport = createAsyncThunk(
    'reports/getExpenses',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/expensesreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getMonthlyReport = createAsyncThunk(
    'reports/getMonthlyReport',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/chart/getmonthsales', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProducts = createAsyncThunk(
    'reports/getProducts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/productsreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getIncomings = createAsyncThunk(
    'reports/getIncomings',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/incomingsreport', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getReportsForTotal = createAsyncThunk(
    'reports/getReportsForTotal',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/getreports', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getSaleProducts = createAsyncThunk(
    'reports/getSaleProducts',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/getsaleproducts', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const changeDebtComment = createAsyncThunk(
    'reports/changeDebtComment',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/reports/debtcomment', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const reportSlice = createSlice({
    name: 'cash',
    initialState: {
        reports: null,
        productreport: null,
        incomingreport: null,
        totalreports: null,
        saleproductsreport: null,
        loading: false,
        errorReports: null,
        datas: [],
        count: 0,
        monthlyReport: null,
        monthlyReportLoading: true,
        monthlyReportError: null,
        debtcomment: null,
        successDebtComment: false,
        debtid: null,
        totalpayment: null,
        startDate: new Date(
            new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            ).setHours(0, 0, 0, 0)
        ).toISOString(),
        endDate: new Date(
            new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            ).setHours(23, 59, 59, 59)
        ).toISOString(),
    },
    reducers: {
        clearErrorReports: (state) => {
            state.errorReports = null
        },
        clearDatas: (state) => {
            state.datas = []
            state.count = 0
        },
        changeStartDate: (state, {payload}) => {
            state.startDate = payload.start
        },
        changeEndDate: (state, {payload}) => {
            state.endDate = payload.end
        },
        setDebtComment: (state, {payload: {comment, debtid}}) => {
            state.debtcomment = comment
            state.debtid = debtid
        },
        clearSuccessDebtComment: (state) => {
            state.successDebtComment = false
        },
    },
    extraReducers: {
        [getReports.pending]: (state) => {
            state.loading = true
        },
        [getReports.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.reports = payload
        },
        [getReports.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorReports = payload
            universalToast(payload, 'error')
        },
        [getSales.pending]: (state) => {
            state.loading = true
        },
        [getSales.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getSales.fulfilled]: (state, {payload: {data, count}}) => {
            state.loading = false
            state.datas = data
            state.count = count
        },
        [getProfit.pending]: (state) => {
            state.loading = true
        },
        [getProfit.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getProfit.fulfilled]: (state, {payload: {data, count}}) => {
            state.loading = false
            state.datas = data
            state.count = count
        },
        [getPaymentReport.pending]: (state) => {
            state.loading = true
        },
        [getPaymentReport.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getPaymentReport.fulfilled]: (
            state,
            {payload: {data, count, total}}
        ) => {
            state.loading = false
            state.datas = data
            state.count = count
            state.totalpayment = total
        },
        [getDebts.pending]: (state) => {
            state.loading = true
        },
        [getDebts.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getDebts.fulfilled]: (state, {payload: {data}}) => {
            state.loading = true
            state.datas = data
        },
        [getDiscounts.pending]: (state) => {
            state.loading = true
        },
        [getDiscounts.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getDiscounts.fulfilled]: (state, {payload: {data, count}}) => {
            state.loading = true
            state.datas = data
            state.count = count
        },
        [payDebt.pending]: (state) => {
            state.loading = true
        },
        [payDebt.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [payDebt.fulfilled]: (state) => {
            state.loading = false
        },
        [getBackProducts.pending]: (state) => {
            state.loading = true
        },
        [getBackProducts.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getBackProducts.fulfilled]: (state, {payload: {data, count}}) => {
            state.loading = false
            state.datas = data
            state.count = count
        },
        [getExpensesReport.pending]: (state) => {
            state.loading = true
        },
        [getExpensesReport.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getExpensesReport.fulfilled]: (state, {payload: {data, count}}) => {
            state.loading = true
            state.datas = data
            state.count = count
        },
        [getMonthlyReport.pending]: (state) => {
            state.monthlyReportLoading = true
        },
        [getMonthlyReport.rejected]: (state, {payload}) => {
            state.monthlyReportLoading = false
            universalToast(payload, 'error')
        },
        [getMonthlyReport.fulfilled]: (state, {payload}) => {
            state.monthlyReportLoading = false
            state.monthlyReport = payload
        },
        [getProducts.pending]: (state) => {
            state.loading = true
        },
        [getProducts.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.productreport = payload
        },
        [getProducts.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getIncomings.pending]: (state) => {
            state.loading = true
        },
        [getIncomings.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.incomingreport = payload
        },
        [getIncomings.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(`${payload}`, 'error')
        },
        [getReportsForTotal.pending]: (state) => {
            state.loading = true
        },
        [getReportsForTotal.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.totalreports = payload
        },
        [getReportsForTotal.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorReports = payload
            universalToast(payload, 'error')
        },
        [getSaleProducts.pending]: (state) => {
            state.loading = true
        },
        [getSaleProducts.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.saleproductsreport = payload
        },
        [getSaleProducts.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
        [changeDebtComment.pending]: (state) => {
            state.loading = true
        },
        [changeDebtComment.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
        [changeDebtComment.fulfilled]: (state) => {
            state.loading = false
            state.successDebtComment = true
        },
    },
})

export const {
    clearErrorReports,
    clearDatas,
    changeStartDate,
    changeEndDate,
    setDebtComment,
    clearSuccessDebtComment,
} = reportSlice.actions
export default reportSlice.reducer
