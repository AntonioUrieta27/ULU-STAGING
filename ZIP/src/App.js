import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

//Routes
import PrivateRoute from './components/_routes/PrivateRoute';
import PublicRoute from './components/_routes/PublicRoute';
import ClientRoute from './components/_routes/ClientRoute';
import AdminRoute from './components/_routes/AdminRoute';

// -- Styles -- //
import './styles/index.sass';
import './styles/globalStyles.sass';

// -- Screens Styles -- //
import './screens/Login/index.sass';
import './screens/DashboardClient/index.sass';
import './screens/DashboardAdmin/index.sass';
import './screens/CreateStory/index.sass';

// -- Components Styles -- //
import './components/SalveCopyright/index.sass';
import './components/_modals/index.sass';

// -- Screens -- //
import Login from './screens/Login';
import Public from './screens/Public';
import Profile from './screens/Profile';
import CreateStory from './screens/CreateStory';
import DashboardClient from './screens/DashboardClient';
import DashboardAdmin from './screens/DashboardAdmin';
import Error404 from './screens/404';


// -- Authentication -- //
import useAuthentication from './hooks/useAuthentication';

import { useSelector, useDispatch } from 'react-redux';
import { loginUser, verifyUser } from './features/auth/authSlice';

function App() {
  const { isLoggingIn, user } = useSelector((state) => state.auth);
  const user_auth = useAuthentication();
  const dispatch = useDispatch();

  useEffect(() => {
    const onPageRefresh = () => {
      if (user == null && user_auth != null) {
        dispatch(verifyUser(user_auth));
      }
    };
    onPageRefresh();
  }, [user_auth]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />} >
            <Route path='/login' element={<Login /> } />
            <Route path='/public/:uid' element={<Public /> } />
            <Route element={<Error404 /> }/>
          </Route>
          
          <Route element={<PrivateRoute /> }>
            <Route path='/' element={<Profile />} />
            <Route path='/create-story' element={<CreateStory /> } />
          </Route>

          <Route  element={<ClientRoute /> }>
            <Route path='/dashboard' element={<DashboardClient /> } />
          </Route>    
          <Route  element={<AdminRoute /> } >
           <Route path='/admin/dashboard' element={<DashboardAdmin /> } /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
