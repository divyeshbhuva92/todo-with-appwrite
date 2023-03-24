import { Avatar, Paper, Text, useMantineTheme } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { account, databases } from "../../../appwriteConfig";
import InfoIcon from '@mui/icons-material/Info';

export default function ContactHome() {
  const theme = useMantineTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const dbID = "6409d0710846c3cefc3c";
  const collID = "640afd331648e5db2c79";
  const [currentUserContact, setCurrentUserContact] = useState([]);

  // ------------------------------ get userID -----------------------------------
  const [userID, setUserID] = useState([]);

  useEffect(() => {
    const getUser = account.get();
    getUser
      .then((response) => {
        setUserID(response.$id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // ------------------------------ get contacts collection -----------------------------------

  useEffect(() => {
    const getContacts = databases.listDocuments(dbID, collID);

    getContacts
      .then((res) => {
        setCurrentUserContact(res.documents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location]);

  // ------------------------------ filter contacts per user -----------------------------------

  const contactList = currentUserContact.filter(
    (doc) => doc.user_id === userID
  );

  // ------------------------------ delete contacts  -----------------------------------

  const contactDelete = (id) => {
    const deleteitem = databases.deleteDocument(dbID, collID, id);

    deleteitem
      .then(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log(err.message);
        }
      )
      .then(() => navigate(location.pathname))
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="contacthome-container">
      <div className="Headers">Contacts</div>

      <div className="contact-list">
        {contactList &&
          contactList.map((elem) => {
            return (
              <Paper className="contact" shadow="lg" radius="md" key={elem.$id}>
                <div className="contact-imgand-name">
                  <Avatar
                    className="contact-img"
                    color="blue"
                    src={elem.user_img}
                  />

                  <div>
                    <Text className="contact-name">
                      {elem.first_name + " " + elem.last_name}
                    </Text>
                    <Text className="contact-mobile">{elem.mobile_num}</Text>
                  </div>
                </div>
                <div className="contact-btns">
                  <Paper
                    className="contact-modify-btn edit"
                    sx={{
                      background:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[8]
                          : theme.colors.gray[2],
                    }}
                    component={Link}
                    varient="link"
                    to={`/users/edit-contact/${elem.$id}`}
                  >
                    <EditRoundedIcon />
                  </Paper>

                  <Paper
                    className="contact-modify-btn delete"
                    sx={{
                      background:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[8]
                          : theme.colors.gray[2],
                    }}
                    onClick={() => contactDelete(elem.$id)}
                  >
                    <DeleteIcon />
                  </Paper>

                  <Paper
                    className="contact-modify-btn info"
                    sx={{
                      color:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[2]
                          : theme.colors.gray[8],
                    }}
                    component={Link}
                    varient="link"
                    to={`/users/${elem.$id}`}
                  >
                    <InfoIcon  />
                  </Paper>
                </div>
              </Paper>
            );
          })}
      </div>

      {/*  */}
    </div>
  );
}
