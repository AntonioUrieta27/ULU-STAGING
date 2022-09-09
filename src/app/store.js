import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import registrationReducer from '../features/registration/registrationSlice';
import adminReducer from '../features/admin/adminSlice';
import clientReducer from '../features/client/clientSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    register: registrationReducer,
    admin: adminReducer,
    client: clientReducer,
    user: userReducer  
  }
});
