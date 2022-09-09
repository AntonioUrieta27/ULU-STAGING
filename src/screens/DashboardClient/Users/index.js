import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";
import "./index.sass";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  createUser,
  deleteUser,
  createMultipleUsers,
} from "../../../features/client/clientSlice";
//Components
import { confirmModal } from "../../../components/_modals/ConfirmModal";

//Icons
import {
  BsFillTrashFill,
  BsFillPersonPlusFill,
  BsUpload,
  BsDownload,
  BsFillFolderFill
} from "react-icons/bs";

const Index = () => {
  const { loading, users, client_error } = useSelector((state) => state.client);
  useEffect(() => {
    setlistUsers(users)
  }, [users])

  const { user } = useSelector((state) => state.auth);
  const [listUsers, setlistUsers] = useState(users);
  const [orderAlf, setorderAlf] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUsers = () => {
      dispatch(fetchUsers({ client_id: user.client_id, uid: user.uid }));
    };
    if (user !== null) getUsers();

  }, []);

  const handleDelete = (uid) => {
    confirmModal({
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      const response = await dispatch(deleteUser(uid));
      if (result.isConfirmed && response) {
        Swal.fire("Deleted!", "The user has been deleted.", "success");

      }
    });
  };
  const handleShowStories = async (stories) => {

    const arraynotification = stories.map((notification) => {

      return `<a href="public/${notification?.uid}" target="_blank"><u>${notification?.title}</u></a>`
    });
    const responseswal = await Swal.fire({
      title: '<strong>List To <u>Stories</u></strong>',
      icon: 'info',
      html: arraynotification.join('<br/>'),
      showCloseButton: true,
      focusConfirm: false,
    }).then((result) => {


    })
  }
  const handleCreateUser = async () => {
    //Request First & Last Name
    const { value } = await Swal.fire({
      title: "Creating new user",
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
      title: "Great! Email address?",
      input: "email",
      inputPlaceholder: `Enter ${firstName}'s email address`,
    });

    if (email) {
      // @Guido creates user
      const response = await dispatch(
        createUser({
          name: firstName,
          lastname: lastName,
          email,
          client_id: user.client_id,
          rol: 2,
          idManager: user.uid,
          emailManager: user.email,
        })
      );
     
      if (!client_error && response) {
        dispatch(fetchUsers({ client_id: user.client_id, uid: user.uid })).then(() => {
          Swal.fire("Created!", "The user has been created.", "success");
        }
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

  const handleCreateManager = async () => {
    const { value } = await Swal.fire({
      title: "Creating new manager",
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
      title: "Great! Email address?",
      input: "email",
      inputPlaceholder: `Enter ${firstName}'s email address`,
    });

    if (email) {
      // @Guido creates manager
     await dispatch(
        createUser({
          rol: 1,
          name: firstName,
          lastname: lastName,
          email,
          client_id: user.client_id,
          idManager: user.uid,
          emailManager: user.email,
        })
      );
      if (!client_error) {
        Swal.fire(
          `${firstName}'s account created!`,
          `Email: ${email} Password: ${email}`,
          "success"
        );
        setorderAlf(!orderAlf);
        setSort("name")
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }
  };
  const headers = [
    { label: "name", key: "name" },
    { label: "lastname", key: "lastname" },
    { label: "email", key: "email" }
  ];

  const data = [
    { name: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
    { name: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
    { name: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
  ];
  const functionOrder = (paramOrder) => {
    const newList = [...listUsers];
    const newOrder = newList?.sort(function (a, b) {
      if (a[paramOrder].toLowerCase() > b[paramOrder].toLowerCase()) {
        return orderAlf ? -1 : 1;
      }
      if (a[paramOrder].toLowerCase() < b[paramOrder].toLowerCase()) {
        return orderAlf ? 1 : -1;
      }
      // a must be equal to b
      return 0;
    })
    setorderAlf(!orderAlf);
    setlistUsers([...newOrder]);
  }
  const setSort = (typeOrder) => {
    functionOrder(typeOrder)
  }
  const handleForce = async (data, fileInfo, rol) => {
    if (fileInfo?.type !== "text/csv") {
      Swal.fire(
        'Oh no!',
        'Incorrect file type, csv only',
        'error'
      );
    } else {

      if (data.length > 0) {

        const response = await dispatch(
          createMultipleUsers({
            users: data,
            client_id: user.client_id,
            rol,
            idManager: user.uid,
            emailManager: user.email,
          })
        );
        if (response.payload.length > 0) {
          Swal.fire(
            'Success!',
            'Users created',
            'success'
          );
          setSort("created_at")
        }
       else {
        Swal.fire(
          'Oh no!',
          'No data to create',
          'error'
        );
      }
      } else {
        Swal.fire(
          'Oh no!',
          'No data to upload',
          'error'
        );
      }


    }
  }
 const handleForceUser = async (data,fileInfo) => {
  handleForce(data, fileInfo, 2);
  }
  const handleForceManager = async (data,fileInfo) => {
    handleForce(data, fileInfo, 1);
    }
  return (
    <Skeleton isLoaded={!loading}>
      <div className="client-table">
        <div className="header-table">
          <div className="left">
            <div className="title">Users</div>
          </div>
          <div className="wrapper">
            <div className="subwrapper">
              <Button
                bgColor="brand.900"
                color="gray.100"
                onClick={() => handleCreateUser()}
                leftIcon={<BsFillPersonPlusFill />}
              >
                Create User
              </Button>
              <Button
                bgColor="brand.900"
                color="gray.100"

                leftIcon={<BsUpload />}
              > <CSVReader
                  onFileLoaded={handleForceUser}
                  label="Upload Users"
                  onError={err => {
                    console.log(err);
                  }}
                  parserOptions={{
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
                  }}
                  inputId="ObiWan"
                  inputStyle={{
                    color: "green",
                    backgroundColor: "black",
                    borderRadius: 10,
                    display: "none"
                  }}
                />

              </Button>
            </div>
            <div className="subwrapper">
              <Button
                bgColor="brand.900"
                color="gray.100"
                onClick={() => handleCreateManager()}
                leftIcon={<BsFillPersonPlusFill />}
              >
                Create Manager
              </Button>
              <Button
                bgColor="brand.900"
                color="gray.100"
                leftIcon={<BsUpload />}
              >
                <CSVReader
                  onFileLoaded={handleForceManager}
                  label="Upload Managers"
                  onError={err => {
                    console.log(err);
                  }}
                  parserOptions={{
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
                  }}
                  inputId="ObiWan"
                  inputStyle={{
                    color: "green",
                    backgroundColor: "black",
                    borderRadius: 10,
                    display: "none"
                  }}
                />
              </Button>
            </div>
            <div className="subwrapper">
              <CSVLink data={data} headers={headers}>

                <Button
                  bgColor="brand.900"
                  color="gray.100"
                  leftIcon={<BsDownload />}
                >
                  Example CSV
                </Button>
              </CSVLink>

            </div>
          </div>
        </div>
        <Table variant="simple">
          <Thead style={{ backgroundColor: "gray" }}>
            <Tr>
              <Th
                onClick={() => setSort("name")}
                style={{ color: "white" }}>
                <span>User</span>

              </Th>
              <Th

                onClick={() => setSort("email")}
                style={{ color: "white" }}><span>E-mail</span></Th>
              <Th style={{ color: "white" }} 
               onClick={() => setSort("created_at")}
              isNumeric>
                
                <span>Registration date</span>
              </Th>
              <Th />
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {listUsers?.map((userlist) =>
            (
              <Tr key={userlist.email}>
                <Td>{`${userlist.name} ${userlist.lastname}`}</Td>
                <Td>{userlist.email}</Td>
                <Td isNumeric>{userlist.created_at ? userlist.created_at : "none"}</Td>
                <Td><Button onClick={() => handleShowStories(userlist.stories)} leftIcon={<BsFillFolderFill />} /></Td>
                <Td
                  onClick={() => handleDelete(userlist.uid)}
                  className="icon"
                  width="2em"
                >
                  <BsFillTrashFill />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Skeleton>
  );
};

export default Index;
