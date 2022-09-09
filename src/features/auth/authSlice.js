import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../../services/firebase';
import { database } from '../database/database';


export const loginUser = createAsyncThunk(
    'auth/logUser',
    async ([email, password]) => {
        try{

            let users_uids = (await db.ref('users').get()).val();
            
            for(let user_uid in users_uids){
                let user_data = await database.getUser(user_uid);
                if(user_data.pending && user_data.email == email){
                    let new_user_auth = await auth.createUserWithEmailAndPassword(email, password);
                    return await database.updateUserUID(new_user_auth.user.uid, user_uid);
                }
            }

            const response = await auth.signInWithEmailAndPassword(email, password);
            
            let user = await database.getUser(response.user.uid);
            user = { 
                ...user,
                uid: response.user.uid
            }
            return user;
        }catch(error){
            let users_uids = (await db.ref('users').get()).val();
            
            for(let user_uid in users_uids){
                let user_data = await database.getUser(user_uid);
                if(user_data.email == email && user_data.password == password){
                    let new_user_auth = await auth.createUserWithEmailAndPassword(email, password);
                    
                    return await database.updateUserUID(new_user_auth.user.uid, user_uid);
                }
            }
            return 'error';         
        }
    }
)

export const verifyUser = createAsyncThunk(
    'auth/verifyUser',
    async (user) => {
        let user_data = await database.getUser(user.uid);
        
        user_data = {
            ...user_data,
            uid: user.uid
        };

        return user_data;
    }
)

export const resetUserPassword = createAsyncThunk(
    'resetpassword/response',
    async (password) => {
        console.log(password)
        try{
            console.log("entramos al dispatch para el cambio de password")
            await auth.currentUser.updatePassword(password);

            const user =  (await db.ref('users').child(auth.currentUser.uid).get()).val()
            console.log(user)
            await database.updateUserFirstEmail(user);
            console.log("se actualizo el password")
            
            
            return true;
        }catch(e){
            console.log(e)
            return e;
        }        
    }
)

export const resetModal = createAsyncThunk(
    'resetmodal/response',
    async (user) => {
        console.log(user);

        try{
            const user =  (await db.ref('users').child(auth.currentUser.uid).get()).val();
            await database.updateUserFirstEmail(user);
            return null;
        }catch(e){
            console.log(e)
            return e;
        }        
    }
)

export const resetModal2 = createAsyncThunk(
    'resetmodal/response',
    async (user) => {
        console.log(user);
        try{
            console.log("entramos al dispatch para no preguntar de nuevo")
            const user =  (await db.ref('users').child(auth.currentUser.uid).get()).val();
            console.log(user)
            await database.updateUserFirstEmail(user);
            return true;
        }catch(e){
            console.log(e)
            return e;
        }        
    }
)


export const forgotPassword = createAsyncThunk(
    'auth/forgotpassword',
    async (email) => {
        try{
            await auth.sendPasswordResetEmail(email)
            return 'success'
        }catch(e){
            console.log(e);
            return 'failed'
        }
        
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        await auth.signOut();
    }
)


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggingIn: false,
        loading: false,
        user: null,
        auth_error: null,
        msg: null
    },
    reducers: {
        
    },
    extraReducers: {
        [loginUser.pending]: (state, action) => {
            state.loading = true;
        },
        [loginUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = true;
            state.auth_error = null;
            state.user = action.payload;
        },
        [loginUser.rejected]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = false;
            state.auth_error = action.error.message;
        },

        [verifyUser.pending]: (state, action) => {
            state.loading = true;
        },
        [verifyUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = true;
            state.auth_error = null;
            if(state.user == null){
                state.user = action.payload;
            }    
        },
        [verifyUser.rejected]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = false;
            state.auth_error = action.error.message;
            
        },

        [resetUserPassword.pending]: (state, action) => {
            state.loading = true;
        },
        [resetUserPassword.fulfilled]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = true;
            state.auth_error = null;
            //state.user = action.payload;
        },
        [resetUserPassword.rejected]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = false;
            state.auth_error = action.error.message;
        },

        [logoutUser.pending]: (state, action) => {
            state.loading = true;
        },
        [logoutUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = false;
            state.auth_error = null
            state.user = null;
        },
        [logoutUser.rejected]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = false;
            state.auth_error = action.error.message;
        },

        [forgotPassword.pending]: (state, action) => {
            state.loading = true;
        },
        [forgotPassword.fulfilled]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = false;
            state.auth_error = null;
            state.user = null;
            state.msg = action.payload;
            console.log(action.payload)
        },
        [forgotPassword.rejected]: (state, action) => {
            state.loading = false;
            state.isLoggingIn = false;
            state.auth_error = action.error.message;
            console.log(action.error.message)
        },
    }
});

export const {  } = authSlice.actions;

export default authSlice.reducer;