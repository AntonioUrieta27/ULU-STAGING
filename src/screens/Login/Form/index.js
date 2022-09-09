import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, forgotPassword } from "../../../features/auth/authSlice";
import { motion } from "framer-motion";
import {
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

//Icons
import { FaLock, FaEnvelope, FaHashtag } from "react-icons/fa";

//Functions
import { handleLogin } from "../functions";

//Framer Motion Variants

const variantsContainer = {
  hidden: { y: "100vh" },
  visible: { y: 0, transition: { duration: 0.4 } },
  exit: { y: "100vh" },
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ease: "easeInOut", delay: 0.6 } },
  exit: { opacity: 0 },
};

const Form = () => {
  let navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const { isLoggingIn, auth_error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    console.log(auth_error);
  }, [auth_error]);

  useEffect(() => {
    const redirect = () => {
      switch (user.rol) {
        case 0:
          navigate("/admin/dashboard");
          break;
        case 1:
          navigate("/dashboard");
          break;
        case 2:
          navigate("/");
          break;
        default:
          navigate("/login");
          break;
      }
    };

    if (isLoggingIn) redirect();
  }, [isLoggingIn, auth_error, user]);

  const onSubmit = () => {
    setLoading(true);
    const validation_result = handleLogin(
      email,
      pw,
      setLoading,
      setError,
      navigate
    );

    if (validation_result) {
      //Dispatch login
      dispatch(loginUser([email, pw])).then((res) => {
        setLoading(false);
        if (res.payload === "error") {
          //Login error toast
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      });
    } else {
      navigate("/");
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: "Forgot your password?",
      html: `<input type="email" id="email" class="swal2-input" placeholder="Email Address">`,
      confirmButtonText: "Reset Password",
      focusConfirm: false,
      preConfirm: () => {
        const email = Swal.getPopup().querySelector("#email").value;
        console.log(email);
        if (!email) {
          Swal.showValidationMessage(`Please enter your email address`);
        }
        return { email };
      },
    }).then((result) => {
      if (result.value) {
        console.log(result.value);
        Swal.fire(
          `
          Sent link to : ${result.value.email}
        `.trim()
        );
        dispatch(forgotPassword(result.value.email));
      }
    });

    
  };

  return (
    <motion.div
      variants={variantsContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="form"
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="wrapper"
      >
        {auth_error ? <p>{auth_error}</p> : null}

        <div className="title">Enter your credentials</div>
        <Stack spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<FaEnvelope />} />
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              id="email"
            />
          </InputGroup>

          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<FaLock />} />
            <Input
              onChange={(e) => setPw(e.target.value)}
              type="password"
              id="password"
              placeholder="Password"
            />
          </InputGroup>

          <Button
            isLoading={loading}
            loadingText="Submitting"
            onClick={() => onSubmit()}
            color="white"
            bgColor="brand.900"
            size="lg"
          >
            Log in
          </Button>
          <div className="forgot-pw" onClick={() => handleForgotPassword()}>
            Forgot password?
          </div>
        </Stack>
        <div className="error">{error}</div>
      </motion.div>
    </motion.div>
  );
};

export default Form;
