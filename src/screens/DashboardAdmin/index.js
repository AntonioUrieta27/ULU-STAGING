import React, { useEffect } from 'react';
import { Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
//Components
import Clients from './Clients';
import Buttons from './Buttons';
import Copyright from '../../components/Copyright';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCompanies,
  addCompany,
  selectCompany,
  deleteCompany,
} from '../../features/admin/adminSlice';
import { logoutUser } from '../../features/auth/authSlice';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import Spinner from '../../components/_elements/Spinner';

//Variants Framer Motion
const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ease: 'easeInOut', delay: 0.6, when: 'beforeChildren' },
  },
  exit: { opacity: 0, transition: { when: 'afterChildren' } },
};

const variantsContainer = {
  hidden: { y: '-50vh' },
  visible: {
    y: 0,
    transition: {
      delay: 0.6,
      ease: 'easeInOut',
      duration: 0.6,
      when: 'beforeChildren',
    },
  },
  exit: { y: '-50vh' },
};

const Index = () => {
  const { loading, company, companies, admin_error } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCompanies = () => {
      dispatch(fetchCompanies());
    };
    getCompanies();
  }, [companies]);

  const handleDeleteCompany = (id) => {
    dispatch(deleteCompany(id));
  };

  // useEffect(() => {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "Message from Salvé Agency",
  //     text: "Please regularize your payments with Salve Agency or the platform and services associated will be disabled",
  //   });
  // }, []);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="dashboard-admin"
    >
      <motion.div
        variants={variantsContainer}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="header"
      >
        <div className="container">
          <img src="/assets/logo2.svg" alt="" />
          {/* <button onClick={() => dispatch(logoutUser())}>Log out</button> */}
          <Buttons />
        </div>
      </motion.div>
      <motion.div variants={variants} className="content">
        <div className="container">
          {/* {loading && <Spinner />} */}
          <Skeleton isLoaded={!loading}>
            <Clients deleteCompany={handleDeleteCompany} clients={companies} />
          </Skeleton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
