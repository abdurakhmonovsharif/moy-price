import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api.js'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'
import {map} from 'lodash'

export const getMarkets = createAsyncThunk(
    'adminproducts/getMarkets',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/administrator/getmarkets', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getMarketsByFilter = createAsyncThunk(
    'adminproducts/getMarketsByFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/administrator/getmarkets', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getBranchesByFilter = createAsyncThunk(
    'adminproducts/getBranchesByFilter',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/administrator/getmarketcontrols',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const getBranches = createAsyncThunk(
    'adminproducts/getBranches',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/administrator/getmarketcontrols',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateMarkets = createAsyncThunk(
    'adminproducts/updateMarkets',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/administrator/updatemarkets', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const createMarket = createAsyncThunk(
    'adminproducts/createMarket',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/market/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const createDirector = createAsyncThunk(
    'adminproducts/createDirector',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/director/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const editDirector = createAsyncThunk(
    'adminproducts/editDirector',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/user/edit', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const editMarket = createAsyncThunk(
    'adminproducts/editMarket',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/market/edit', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteMarket = createAsyncThunk(
    'adminproducts/deleteMarket',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/administrator/delete', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const adminproductsSlice = createSlice({
    name: 'adminmarkets',
    initialState: {
        markets: [],
        total: 0,
        branches: [],
        totalBranches: 0,
        searchedMarkets: [],
        searchedBranches: [],
        totalSearchedBranches: 0,
        totalSearched: 0,
        loadingGetMarkets: true,
        errorGetMarkets: null,
        loadingCreateMarket: false,
        errorCreateMarket: null,
        loadingCreateDirector: false,
        errorCreateDirector: null,
        loadingGetBranches: false,
        errorGetBranches: null,
        loadingUpdateMarkets: false,
        errorUpdateMarkets: null,
        loadingDeleteMarket: false,
    },
    reducers: {
        clearSearchedMarkets: (state) => {
            state.searchedMarkets = []
            state.totalSearched = 0
        },
        clearSearchedBranches: (state) => {
            state.searchedBranches = []
            state.totalSearchedBranches = 0
        },
    },
    extraReducers: {
        [getMarkets.pending]: (state) => {
            state.loadingGetMarkets = true
        },
        [getMarkets.fulfilled]: (state, {payload: {markets, count}}) => {
            if (state.searchedMarkets.length > 0) {
                state.searchedMarkets = markets
                state.totalSearched = count
            } else {
                state.markets = markets
                state.total = count
            }
            state.loadingGetMarkets = false
        },
        [getMarkets.rejected]: (state, {payload}) => {
            state.errorGetMarkets = payload
            state.loadingGetMarkets = false
            universalToast(payload, 'error')
        },
        [getMarketsByFilter.pending]: (state) => {
            state.loadingGetMarkets = true
        },
        [getMarketsByFilter.fulfilled]: (
            state,
            {payload: {markets, count}}
        ) => {
            state.searchedMarkets = markets
            state.totalSearched = count
            state.loadingGetMarkets = false
        },
        [getMarketsByFilter.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingGetMarkets = false
        },
        [createMarket.pending]: (state) => {
            state.loadingCreateMarket = true
        },
        [createMarket.rejected]: (state, {payload}) => {
            state.loadingCreateMarket = false
            universalToast(payload, 'error')
        },
        [createDirector.pending]: (state) => {
            state.loadingCreateDirector = true
        },
        [createDirector.rejected]: (state, {payload}) => {
            state.loadingCreateDirector = false
            universalToast(payload, 'error')
        },
        [editDirector.pending]: (state) => {
            state.loadingCreateDirector = true
        },
        [editDirector.rejected]: (state, {payload}) => {
            state.loadingCreateDirector = false
            universalToast(payload, 'error')
        },
        [getBranchesByFilter.pending]: (state) => {
            state.loadingGetBranches = true
        },
        [getBranchesByFilter.fulfilled]: (
            state,
            {payload: {markets, count}}
        ) => {
            state.searchedBranches = markets
            state.totalSearchedBranches = count
            state.loadingGetBranches = false
        },
        [getBranchesByFilter.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingGetBranches = false
        },
        [getBranches.pending]: (state) => {
            state.loadingGetBranches = true
        },
        [getBranches.fulfilled]: (state, {payload: {markets, count}}) => {
            if (state.searchedBranches.length > 0) {
                state.searchedBranches = markets
                state.totalSearchedBranches = count
            } else {
                state.branches = markets
                state.totalBranches = count
            }
            state.loadingGetBranches = false
        },
        [getBranches.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingGetBranches = false
            state.errorGetBranches = payload
        },
        [updateMarkets.pending]: (state) => {
            state.loadingUpdateMarkets = true
        },
        [updateMarkets.fulfilled]: (state, {payload: {markets, market}}) => {
            state.loadingUpdateMarkets = false
            if (state.searchedBranches.length > 0) {
                state.searchedBranches = state.searchedBranches.map((sb) =>
                    sb._id === markets[0]._id ? markets[0] : sb
                )
            }
            state.branches = map(state.branches, (sb) =>
                sb._id === markets[0]._id ? markets[0] : sb
            )
            state.markets = map(state.markets, (m) =>
                m._id === market._id ? market : m
            )
            if (state.searchedMarkets.length > 0) {
                state.searchedMarkets = map(state.searchedMarkets, (m) =>
                    m._id === market._id ? market : m
                )
            }
        },
        [updateMarkets.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingUpdateMarkets = false
            state.errorUpdateMarkets = payload
        },
        [editMarket.pending]: (state) => {
            state.loadingGetMarkets = true
        },
        [editMarket.fulfilled]: (state, {payload}) => {
            state.loadingGetMarkets = false
            state.markets = map(state.markets, (m) =>
                m._id === payload._id ? payload : m
            )
            if (state.searchedMarkets.length > 0) {
                state.searchedMarkets = map(state.searchedMarkets, (m) =>
                    m._id === payload._id ? payload : m
                )
            }
        },
        [editMarket.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingGetMarkets = false
        },
        [deleteMarket.pending]: (state) => {
            state.loadingDeleteMarket = true
        },
        [deleteMarket.fulfilled]: (state) => {
            state.loadingDeleteMarket = false
            universalToast(
                "Do'kon ma'lumotlari muvaffaqqiyatli o'chirildi",
                'success'
            )
        },
        [deleteMarket.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
            state.loadingDeleteMarket = false
        },
    },
})
export const {clearSearchedMarkets, clearSearchedBranches} =
    adminproductsSlice.actions
export default adminproductsSlice.reducer
