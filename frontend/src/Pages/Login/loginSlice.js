import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import Api from '../../Config/Api'
import {successEditProfile, successLoggedIn, universalToast} from '../../Components/ToastMessages/ToastMessages'

const bcryptjs = require('bcryptjs')

const handleChooseTypeOfUser = (type) => {
    const types = ['Admin', 'Director', 'Seller']
    let userType = null
    types.forEach(t => bcryptjs.compareSync(t, type) ? userType = t : null)
    return userType
}


export const signIn = createAsyncThunk(
    'login/signIn',
    async (body = {}, {rejectWithValue}) => {
        try {
            const {
                data: {token, user, market}
            } = await Api.post('/user/login', body)
            return {
                token: token,
                user: user,
                market: market
            }
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const editProfileImage = createAsyncThunk(
    'login/editProfileImage',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/upload', body, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    })

export const editUser = createAsyncThunk(
    'login/editUser',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/user/edit', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const createQrcode = createAsyncThunk(
    'login/createQrcode',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/qrcode/create', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteQrcode = createAsyncThunk(
    'login/deleteQrcode',
    async (body, {rejectWithValue}) => {
        try {
            const {data} = await Api.post('/qrcode/delete', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const slice = createSlice({
    name: 'login',
    initialState: {
        user: null,
        market: null,
        logged: false,
        loading: false,
        qrcode: null,
        error: null
    },
    reducers: {
        logIn: (state, {payload: {user, market}}) => {
            let type = handleChooseTypeOfUser(user.type)
            if (type) {
                state.logged = true
                state.user = {
                    ...user,
                    type: type
                }
                state.market = market
            } else {
                localStorage.removeItem('userData')
                state.logged = false
                state.user = null
                state.market = null
                state.error = 'Invalid user type'
            }
        },
        logOut: (state, {payload}) => {
            localStorage.removeItem('userData')
            state.logged = false
            state.user = null
            state.market = null
            state.error = payload
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: {
        [signIn.pending]: (state) => {
            state.loading = true
        },
        [signIn.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.logged = true
            state.user = {
                ...payload.user,
                type: handleChooseTypeOfUser(payload.user.type)
            }
            state.market = payload.market
            localStorage.setItem('userData', JSON.stringify(payload))
            successLoggedIn()
        },
        [signIn.rejected]: (state, {payload}) => {
            state.loading = false
            state.error = payload
        },
        [editProfileImage.rejected]: (state, {payload}) => {
            universalToast(payload, 'error')
        },
        [editUser.pending]: (state) => {
            state.loading = true
        },
        [editUser.fulfilled]: (state, {payload}) => {
            const prevUser = JSON.parse(localStorage.getItem('userData'))
            const newUser = {
                ...prevUser,
                user: payload
            }
            localStorage.setItem('userData', JSON.stringify(newUser))
            state.loading = false
            state.user = payload
            successEditProfile()
        },
        [editUser.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
        [createQrcode.pending]: (state) => {
            state.loading = true
        },
        [createQrcode.fulfilled]: (state, {payload}) => {
            console.log(payload);
            state.loading = false
            state.market = {
                ...state.market,
                qrcode: payload
            }
        },
        [createQrcode.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        },
        [deleteQrcode.pending]: (state) => {
            state.loading = true
        },
        [deleteQrcode.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.market = {
                ...state.market,
                qrcode: ""
            }
        },
        [deleteQrcode.rejected]: (state, {payload}) => {
            state.loading = false
            universalToast(payload, 'error')
        }
    }
})

export const {logOut, logIn, clearError} = slice.actions
export default slice.reducer
