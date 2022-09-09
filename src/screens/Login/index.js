import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './index.sass';

//Components
import ClientInfo from './ClientInfo';
import Form from './Form';
import SalveCopyright from '../../components/SalveCopyright';

//Functions

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: 'easeInOut',
      duration: 0.4,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: 'easeInOut',
      duration: 0.4,
      when: 'afterChildren',
    },
  },
};

const Index = () => {
  // Hooks

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="login"
    >
      <>
        <Form />
        <ClientInfo />
      </>
    </motion.div>
  );
};

export default Index;
