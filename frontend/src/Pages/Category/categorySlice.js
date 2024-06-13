import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'

export const getAllCategories = createAsyncThunk(
    'category/getAllCategories',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/category/getall', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/products/category/getcategories',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/category/register', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getCategoriesByFilter = createAsyncThunk(
    'category/getCategoriesByFilter',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {data} = await Api.post(
                '/products/category/getcategories',
                body
            )
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateCategory = createAsyncThunk(
    'products/updateCategory',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.put('/products/category/update', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'products/deleteCategory',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/products/category/delete', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        allcategories: [],
        categories: [],
        searchedCategories: [],
        total: 0,
        totalSearched: 0,
        loading: false,
        errorGetCategories: null,
        successAddCategory: false,
        errorAddCategory: false,
        successUpdateCategory: false,
        errorUpdateCategory: false,
        successDeleteCategory: false,
        errorDeleteCategory: false,
    },
    reducers: {
        clearErrorGetAllCategories: (state) => {
            state.errorGetCategories = null
        },
        clearSuccessAddCategory: (state) => {
            state.successAddCategory = false
        },
        clearErrorAddCategory: (state) => {
            state.errorAddCategory = false
        },
        clearSearchedCategories: (state) => {
            state.searchedCategories = []
            state.totalSearched = 0
        },
        clearErrorUpdateCategory: (state) => {
            state.errorUpdateCategory = false
        },
        clearSuccessUpdateCategory: (state) => {
            state.successUpdateCategory = false
        },
        clearSuccessDeleteCategory: (state) => {
            state.successDeleteCategory = false
        },
        clearErrorDeleteCategory: (state) => {
            state.errorDeleteCategory = false
        },
        setAllCategories: (state, {payload}) => {
            state.allcategories = [...payload]
        },
    },
    extraReducers: {
        [getAllCategories.pending]: (state) => {
            state.loading = true
        },
        [getAllCategories.fulfilled]: (state, {payload}) => {
            state.allcategories = payload
            state.loading = false
        },
        [getAllCategories.rejected]: (state, {payload}) => {
            state.errorGetCategories = payload
            state.loading = false
            universalToast(payload, 'error')
        },
        [getCategories.pending]: (state) => {
            state.loading = true
        },
        [getCategories.fulfilled]: (state, {payload: {categories, count}}) => {
            state.searchedCategories.length
                ? (state.searchedCategories = categories)
                : (state.categories = categories)
            state.searchedCategories.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.loading = false
        },
        [getCategories.rejected]: (state, {payload}) => {
            state.errorGetCategories = payload
            state.loading = false
            universalToast(payload, 'error')
        },
        [addCategory.pending]: (state) => {
            state.loading = true
        },
        [addCategory.fulfilled]: (state, {payload: {categories, count}}) => {
            state.loading = false
            state.searchedCategories.length
                ? (state.searchedCategories = categories)
                : (state.categories = categories)
            state.searchedCategories.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.successAddCategory = true
        },
        [addCategory.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorAddCategory = payload
        },
        [getCategoriesByFilter.pending]: (state) => {
            state.loading = true
        },
        [getCategoriesByFilter.fulfilled]: (
            state,
            {payload: {categories, count}}
        ) => {
            state.searchedCategories = categories
            state.totalSearched = count
            state.loading = false
        },
        [getCategoriesByFilter.rejected]: (state, {payload}) => {
            state.errorGetCategories = payload
            state.loading = false
        },
        [updateCategory.pending]: (state) => {
            state.loading = true
        },
        [updateCategory.fulfilled]: (state, {payload: {categories, count}}) => {
            state.loading = false
            state.searchedCategories.length
                ? (state.searchedCategories = categories)
                : (state.categories = categories)
            state.searchedCategories.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.successUpdateCategory = true
        },
        [updateCategory.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorUpdateCategory = payload
        },
        [deleteCategory.pending]: (state) => {
            state.loading = true
        },
        [deleteCategory.fulfilled]: (state, {payload: {categories, count}}) => {
            state.loading = false
            state.searchedCategories.length
                ? (state.searchedCategories = categories)
                : (state.categories = categories)
            state.searchedCategories.length
                ? (state.totalSearched = count)
                : (state.total = count)
            state.successDeleteCategory = true
        },
        [deleteCategory.rejected]: (state, {payload}) => {
            state.loading = false
            state.errorDeleteCategory = payload
        },
    },
})

export const {
    clearErrorGetAllCategories,
    clearSearchedCategories,
    clearErrorAddCategory,
    clearSuccessAddCategory,
    clearErrorUpdateCategory,
    clearSuccessUpdateCategory,
    clearSuccessDeleteCategory,
    clearErrorDeleteCategory,
    setAllCategories,
} = categorySlice.actions
export default categorySlice.reducer
