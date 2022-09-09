import React from "react";
import "./index.sass";
import { CloseButton, Input, Button } from "@chakra-ui/react";
import Swal from "sweetalert2";

//Icons
import { BsPersonCheckFill } from "react-icons/bs";

const index = ({ setCreateUserModal }) => {
  const handleCreateUser = () => {
    if (true) {
    } else {
    }
  };

  return (
    <div className="modal" id="create-user-modal">
      <div className="card">
        <CloseButton
          onClick={() => setCreateUserModal(false)}
          position="absolute"
          right="1em"
          top="1em"
        />
        <div className="title">Creating User</div>
        <div className="create-user-form">
          <Input size="lg" type="text" placeholder="First name" />
          <Input size="lg" type="text" placeholder="Last name" />
          <Input size="lg" type="email" placeholder="Email address" />
          <Button
            backgroundColor="brand.900"
            color="gray.100"
            size="lg"
            width="100%"
            iconLeft={<BsPersonCheckFill />}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default index;
