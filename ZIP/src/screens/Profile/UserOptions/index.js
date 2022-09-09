import React, { useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import "./index.sass";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  logoutUser,
  resetUserPassword,
  resetModal,
  resetModal2,
} from "../../../features/auth/authSlice";
import { confirmModal } from "../../../components/_modals/ConfirmModal";
import { auth, db } from '../../../services/firebase';
const UserOptions = () => {
  let navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user.hasToChangePassword == true ) {
      console.log("HAS TO CHANGE PASSWORD");
      console.log(user);
      handleResetPassword();
    }
  }, [user]);

  const handleLogout = () => {
    //navigate("/login");
    dispatch(logoutUser());
    toast({
      title: "Logged out",
      position: "top-right",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  //Handle Reset Password
  const handleResetPassword = () => {
    var password = "";
    Swal.fire({
      title: "Reset Password",
      html: `<input type="password" id="password" class="swal2-input" placeholder="Password">
      <input type="password" id="password-confirm" class="swal2-input" placeholder="Confirm password">`,
      confirmButtonText: "Confirm",
      focusConfirm: false,
      showDenyButton: true,
      denyButtonText: "Don't ask me again",
      preConfirm: () => {
        password = Swal.getPopup().querySelector("#password").value;
        const passwordC =
          Swal.getPopup().querySelector("#password-confirm").value;

        if (!passwordC || !password) {
          Swal.showValidationMessage(`Please enter your password`);
        }
        if (passwordC !== password) {
          Swal.showValidationMessage(`Your password does not match`);
        }
        console.log(password);
        return { password: password };
      },
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        confirmModal({
          confirmButtonText: "Yes, change it",
          cancelButtonText: "No, keep it.",
        }).then((res) => {
          if (res.isConfirmed) {
            console.log(res);
            console.log("entra antes al dispatch");
            console.log("repsuesta del dispatch");
          dispatch(resetUserPassword(password)).then((res) => {
            console.log("entra al dispatch");
            console.log(res);
            if (res.payload === "error") {
              //Login error toast
              Swal.fire("Oops...", "Something went wrong!", "error");
            }
            if(res.payload === true){
              dispatch(resetModal(user));
            handleLogout();
           
            window.location.reload(true);
            navigate("/login");
            }
          });
           
          }
        });
      } else if (result.isDenied) {
            Swal.fire('You can change the password at any time. The application is updated to save changes...', '', 'info').then((r) => {
            if(r.isConfirmed){
              console.log("disable to change password");
              dispatch(resetModal2(user)).then((res) => {
                console.log("entra al a la respuesta del dispatch");
                console.log(res);
                if (res.payload === "error") {
                  //Login error toast
                  Swal.fire("Oops...", "Something went wrong!", "error");
                }
                if(res.payload === true){
                window.location.reload(true);
                  navigate("/login");
                }
              });
             
            }
          })
      }
    });
  };

  return (
    <div id="user-options">
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<FaUser />}
          variant="outline"
          backgroundColor="gray.200"
          borderColor="gray.300"
        />
        <MenuList>
          <MenuItem onClick={() => handleLogout()} icon={<IoLogOutOutline />}>
            Log out
          </MenuItem>
          <MenuItem
            onClick={() => handleResetPassword()}
            icon={<RiLockPasswordLine />}
          >
            Reset Password
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default UserOptions;
