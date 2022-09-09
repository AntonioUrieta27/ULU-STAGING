import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth } from '../../services/firebase';
import { database } from '../database/database';

export const registerUser = createAsyncThunk(
    'createuser/reponse',
    async ([email, password, rol, name, client_id]) => {
        const new_user = await auth.createUserWithEmailAndPassword(email, password);

        await new_user.user.updateProfile({
            displayName: name
        });

        return new_user;
    }
)


export const registrationSlice = createSlice({
    name: 'registration',
    initialState: {
        loading: false,
        register_error: null
    },
    reducers: {

    },
    extraReducers: {
        [registerUser.pending]: (state, action) => {
            state.loading = true;
        },
        [registerUser.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [registerUser.rejected]: (state, action) => {
            state.loading = false;
            state.register_error = action.error.message;;
        }
    }
});

export const {  } = registrationSlice.actions;

export default registrationSlice.reducer;