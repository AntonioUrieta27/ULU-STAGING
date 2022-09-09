import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db, dbManager } from '../../services/firebase';
import { database, emailIsAlreadyInUse } from '../database/database';
import clientAxios from '../../config/axios';


export const createUser = createAsyncThunk(
    'createuser/reponse',
    async ({ email, name, lastname, client_id, rol, idManager, emailManager }) => {
        const result = await emailIsAlreadyInUse(email);
        if (result) {
            let error = 'Email is already in use';
            throw new Error(error);
        } else {
            let date = new Date();
            return await database.addUser({
                email,
                name,
                lastname,
                client_id,
                rol,
                password: email,
                pending: true,
                hasToChangePassword: true,
                idManager,
                emailManager,
                created_at: (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
            });
        }
        /*try{
            
        }catch(e){
            return e;
        }   */
    }
);

export const createMultipleUsers = createAsyncThunk(
    'createmultiple/response',
    async ({ users, client_id, rol,idManager,
        emailManager }) => {
       
            const users_in_use = [];
            const users_verified  = await Promise.all(
             users.map(async user => {
                    if(user?.email){
                        let condition = await emailIsAlreadyInUse(user.email)
                        console.log(condition)
                        if (!condition) {
                            return user;
                        } 
                        users_in_use.push(user);
                        return ;
                        
                    }
                   return;
                })
            );
            const users_verified_filtered = users_verified.filter(user => user !== undefined);
            let date = new Date();
            if(users_verified_filtered.length > 0){
                const users_added = await Promise.all(users_verified_filtered?.map(async user => {
            
                    if((user?.email !== null) && (user?.name !== null) && (user?.lastname !== null)){
                   const resposne= await database.addUser({
                            email: user.email,
                            name: user.name,
                            lastname: user.lastname,
                            client_id,
                            rol,
                            password: user.email,
                            pending: true,
                            hasToChangePassword: true,
                            idManager,
                            emailManager,
                            created_at: (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
                                
                            });
                         
                            return resposne;
                    }
                }));
              
                return users_added;
            }
            return [];
    

       

    }
);

export const deleteUser = createAsyncThunk(
    'deleteuser/response',
    async (uid) => {
        //FALTA BORRAR USUARIO DE FIREBASE AUTH
        try {
            const response = await database.deleteUser(uid);
            if (!response.hasOwnProperty('pending')) {
                await clientAxios.post('/firebase/delete', { user_uid: uid });
            }
            return uid;
        } catch (e) {
            console.log(e)
        }

    }
)

export const fetchUsers = createAsyncThunk(
    'fetchuser/response',
    async ({ client_id, uid }) => {
        const users = (await db.ref('users').get()).val();
        const stories = (await db.ref('stories').get()).val();
        const arrayUSers = Object.values(users);
        const uidArray = Object.keys(users);
        const arrayUsersComplete = await Promise.all( arrayUSers.map((user, index) => {
            return user?.uid ? user : { ...user, uid: uidArray[index] };
        }))
        const arrayStory = Object.values(stories);

        const requested_users = arrayUsersComplete.filter(userCol => userCol.rol == 2 && (userCol.client_id == client_id || userCol.idManager == uid));

        const company_users = await Promise.all(
            requested_users.map(async user => {
                const user_stories = arrayStory.filter(story => story.creator_id == user.uid && story.status == "1");
                let user_config = {
                    ...user,
                    stories: user_stories
                };
                return user_config;
            })
        );

        company_users.sort((a, b) => {
            let a_dates = a.created_at.split('-');
            let b_dates = b.created_at.split('-');

            if (Number(a_dates[0]) > Number(b_dates[0])) {
                return -1;
            } else if (Number(b_dates[0]) == Number(a_dates[0])) {

                if (Number(a_dates[1]) > Number(b_dates[1])) {
                    return -1;

                } else if (Number(a_dates[1]) == Number(b_dates[1])) {

                    if (Number(a_dates[2]) > Number(b_dates[2])) {
                        return -1;

                    } else if (Number(a_dates[2]) == Number(b_dates[2])) {
                        return 0;
                    }
                }
            }
            return 1;
        })

        return company_users;
    }
)

export const clientSlice = createSlice({
    name: 'client',
    initialState: {
        loading: false,
        client_error: null,
        users: [],
        users_error: []
    },
    reducers: {

    },
    extraReducers: {
        [createUser.pending]: (state, action) => {
            state.loading = true;
        },
        [createUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.client_error = null;
            state.users.push(action.payload);
        },
        [createUser.rejected]: (state, action) => {
            state.loading = false;
            state.client_error = action.error.message;
        },

        [createMultipleUsers.pending]: (state, action) => {
            state.loading = true;
        },
        [createMultipleUsers.fulfilled]: (state, action) => {
            state.loading = false;
            state.client_error = null;
            const users_added = action.payload;
            users_added.map(user => {
                state.users.push(user);
            }
            )
    

        
        },
        [createMultipleUsers.rejected]: (state, action) => {
            state.loading = false;
            state.client_error = action.error.message;
        },

        [fetchUsers.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.loading = false;
            state.client_error = null;
            if (JSON.stringify(state.users) !== JSON.stringify(action.payload)) {
                state.users = action.payload;
            }
        },
        [fetchUsers.rejected]: (state, action) => {
            state.loading = false;
            state.client_error = action.error.message;
        },

        [deleteUser.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.client_error = null;
           
            state.users = state.users.filter(user => user.uid !== action.payload);
        },
        [deleteUser.rejected]: (state, action) => {
            state.loading = false;
            state.client_error = action.error.message;
        }
    }
});

export const { } = clientSlice.actions;

export default clientSlice.reducer;