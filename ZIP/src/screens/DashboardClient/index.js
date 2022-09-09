import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

//Components
import Users from './Users';
import Buttons from './Buttons';
import Copyright from '../../components/Copyright';

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
  // -- Hooks -- //
  const dispatch = useDispatch();
  const { loading, client_error } = useSelector((state) => state.client);
  const { user } = useSelector((state) => state.auth);

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
          <Users />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
