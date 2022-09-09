import React from "react";
import "./index.sass";
import {
  Divider,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCompany, addCompany } from "../../../features/admin/adminSlice";

import { confirmModal } from "../../../components/_modals/ConfirmModal";
import Swal from "sweetalert2";

//Icons
import { BsFillPersonPlusFill, BsFillTrashFill } from "react-icons/bs";

const Clients = ({ clients, deleteCompany }) => {
  const { admin_error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const handleDelete = (client_id) => {
    confirmModal({
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "The client has been deleted.", "success");
        deleteCompany(client_id);
      }
    });
  };

  const handleCreate = async () => {
    //Client Name
    const { value: clientName } = await Swal.fire({
      title: "Creating new client",
      input: "text",
      inputPlaceholder: "Enter client's name",
      confirmButtonText: "Next",
    });
    if (!clientName) return;

    //Client Name
    const { value: location } = await Swal.fire({
      title: "Where are they located?",
      input: "text",
      inputPlaceholder: "Enter client's location",
      confirmButtonText: "Next",
    });
    if (!location) return;

    //Request First & Last Name
    const { value } = await Swal.fire({
      title: "Great! Who will be in charge?",
      subtitle: "Wjo wi",
      html: `<input type="text" id="firstName" class="swal2-input" placeholder="First Name">
      <input type="text" id="lastName" class="swal2-input" placeholder="Last Name">`,
      confirmButtonText: "Next",
      focusConfirm: false,
      preConfirm: () => {
        const firstName = Swal.getPopup().querySelector("#firstName").value;
        const lastName = Swal.getPopup().querySelector("#lastName").value;
        if (!firstName || !lastName) {
          Swal.showValidationMessage(`Please fill first name and last name`);
        }
        return { firstName: firstName, lastName: lastName };
      },
    });
    if (!value) return;
    const { firstName, lastName } = value;

    //Request Email
    const { value: email } = await Swal.fire({
      title: "Email address?",
      input: "email",
      inputPlaceholder: `Enter responsable's email address`,
    });

    if (email) {
      // @Guido creates client
      dispatch(
        addCompany({
          name: clientName,
          location: location,
          responsable_email: email,
          responsable_pass: email,
          responsable_name: firstName,
          responsable_lastname: lastName,
        })
      );

      if (!admin_error) {
        Swal.fire(
          `${firstName}'s account created!`,
          `Email: ${email} Password: ${email}`,
          "success"
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }
  };

  return (
    <div className="admin-table">
      <div className="header-table">
        <div className="left">
          <div className="title">Clients</div>
        </div>
        <Button
          bgColor="brand.900"
          color="gray.100"
          onClick={() => handleCreate()}
          leftIcon={<BsFillPersonPlusFill />}
        >
          Create Client
        </Button>
      </div>
      <Table variant="simple">
        <Thead style={{ backgroundColor: "gray" }}>
          <Tr>
            <Th style={{ color: "white" }}>Company</Th>
            <Th style={{ color: "white" }}>Location</Th>
            <Th style={{ color: "white" }} isNumeric>
              Registration date
            </Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {clients.map((client) => (
            <Tr key={client.uid}>
              <Td>{client.name}</Td>
              <Td>{client.location}</Td>
              <Td isNumeric>
                {client.created_at ? client.created_at : "none"}
              </Td>
              <Td
                onClick={() => handleDelete(client.uid)}
                className="icon"
                width="1em"
              >
                <BsFillTrashFill />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default Clients;
