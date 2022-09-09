import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, storage, db } from '../../services/firebase';
import { database, emailIsAlreadyInUse } from '../database/database';

export const fetchCompanies = createAsyncThunk(
    'fetchcompanies/reponse',
    async () => {
        const companies = await database.getCompanies();
        const comapanies_arr = [];
        for(let company in companies){
            const company_data = await database.getCompany(company);
            if(company_data.uid !== '0000') comapanies_arr.push(company_data);            
        }

        comapanies_arr.sort((a, b) => {
            let a_dates = a.created_at.split('-');
            let b_dates = b.created_at.split('-');
            console.log(a_dates)
            console.log(b_dates)
            if(Number(a_dates[0]) > Number(b_dates[0])){
                return -1;
            }else if(Number(b_dates[0]) == Number(a_dates[0])) {

                if(Number(a_dates[1]) > Number(b_dates[1])){
                    return -1;

                }else if(Number(a_dates[1]) == Number(b_dates[1])){

                    if(Number(a_dates[2]) > Number(b_dates[2])){
                        return -1;

                    }else if (Number(a_dates[2]) == Number(b_dates[2])) {
                        return 0;
                    }
                }
            }
            return 1;
        })

        return comapanies_arr;
    }
)

export const addCompany = createAsyncThunk(
    'addcompany/response',
    async (company) => {

        let condition = await emailIsAlreadyInUse(company.responsable_email);

        if(condition){
            let error = 'Email is already in use. Cannot create company.';
            throw new Error(error);
        }

        let date = new Date();
        company.created_at = (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
        const company_created = await database.addCompany(company);
        
        let user_config = {
            email: company_created.responsable_email, 
            password: company_created.responsable_email,
            pending: true,
            name: company_created.responsable_name,
            lastname: company_created.responsable_lastname, 
            client_id: company_created.uid, 
            rol: 1,
            hasToChangePassword: true,
            created_at: (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())
        }
        await database.addUser(user_config);

        return company_created;
    }
)

export const selectCompany = createAsyncThunk(
    'selectcompany/response',
    async (company_uid) => {
        return await database.getCompany(company_uid);
    }
)

export const deleteCompany = createAsyncThunk(
    'deleteCompany/reponse',
    async (company_uid) => {
        await database.deleteCompany(company_uid);
        
        return company_uid;
    }
)

export const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        loading: false,
        company: {
            name: '',
            lastname: '',
            company_name: '',
            address: '',
            email: ''
        },
        companies: [],
        admin_error: null
    },
    reducers: {
        
    },
    extraReducers: {
        [fetchCompanies.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchCompanies.fulfilled]: (state, action) => {
            state.loading = false;
            state.admin_error = null;
            //console.log(action.payload)
            if(JSON.stringify(state.companies) !== JSON.stringify(action.payload)){
                //state.companies = state.companies.filter(company => company.uid !== action.payload.uid)
                state.companies = action.payload;
            }
        },
        [fetchCompanies.rejected]: (state, action) => {
            state.loading = false;
            state.admin_error = action.error.message;
        },

        [addCompany.pending]: (state, action) => {
            state.loading = true;
        },
        [addCompany.fulfilled]: (state, action) => {
            state.loading = false;
            state.admin_error = null;
            state.companies.push(action.payload);
        },
        [addCompany.rejected]: (state, action) => {
            state.loading = false;
            state.admin_error = action.error.message;
        },

        [selectCompany.pending]: (state, action) => {
            state.loading = true;
        },
        [selectCompany.fulfilled]: (state, action) => {
            state.loading = false;
            state.admin_error = null;
            state.company = action.payload;
        },
        [selectCompany.rejected]: (state, action) => {
            state.loading = false;
            state.admin_error = action.error.message;
        },

        [deleteCompany.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteCompany.fulfilled]: (state, action) => {
            state.loading = false;
            state.admin_error = null;
            state.companies = state.companies.filter(company => company.uid === action.payload.uid);
        },
        [deleteCompany.rejected]: (state, action) => {
            state.loading = false;
            state.admin_error = action.error.message;
        },
    }
});

export const { } = adminSlice.actions;

export default adminSlice.reducer;