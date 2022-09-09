import { Navigate } from "react-router-dom";

export const handleLogin = (
  email,
  pw,

  setLoading,
  setError,
  navigate
) => {
  setLoading(true);
  console.log("Validating Login");
  const validation = validateLogin(email, pw, setError);
  return validation;
  if (validation) {
    console.log("Loggin in: ", email, pw);
    //Firebase Login
    // firebase
    //   .auth()
    //   .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    //   .then(() => {
    //     firebase
    //       .auth()
    //       .signInWithEmailAndPassword(email, pw)
    //       .then((userCredential) => {
    //         // Signed in
    //         console.log("Logged In in Firebase Function");
    //         var user = userCredential.user;
    //         if (user) {
    //           console.log(object);
    //         }
    //       });
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     //Mostrar tarjeta de error
    //     toast.error("No se ha podido iniciar Sesión");
    //     console.log(errorCode);
    //   });
    // setTimeout(() => setLoading(false), 2000);
    setLoading(false);
    navigate("/");
  } else {
    setLoading(false);
  }
};

export const validateLogin = (email, pw, setError) => {
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  //Removes Error Class
  setError("");
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  if (email.trim() === "") {
    setError("Please enter an email");
    emailInput.classList.add("input-error");
    return false;
  }

  if (pw.trim() === "") {
    setError("Please enter your password");
    passwordInput.classList.add("input-error");
    return false;
  }

  return true;
};
