import { Image, Menu, Paper, Text } from "@mantine/core";

import HomeIcon from '@mui/icons-material/Home';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { account, userAvtarResult } from "../appwriteConfig";

export default function NavbarContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");

  useEffect(() => {
    const getData = account.get();

    getData
      .then((response) => {
        setUsername(response.name.toUpperCase());
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location.pathname]);

  const userSignOut = async () => {
    try {
      await account.deleteSession("current");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-navbar">
      <div className="navbar-content">
        <Paper
          className="navbar-options"
          component={Link}
          varient="link"
          to="home"
        >
          <HomeIcon fontSize="small" /> Home
        </Paper>

        <Paper className="navbar-options-titles">
          <StickyNote2Icon fontSize="small" /> Todos
        </Paper>

        <Paper
          className="navbar-options"
          component={Link}
          varient="link"
          to="create-todo"
        >
          <NoteAddIcon fontSize="small" /> Add Todo
        </Paper>

        <Paper className="navbar-options-titles">
          <ContactsIcon fontSize="small" /> Contact Book
        </Paper>

        <Paper
          className="navbar-options"
          component={Link}
          varient="link"
          to="create-contact"
        >
          <PersonAddIcon fontSize="small" /> Add Contact
        </Paper>
      </div>

      <div className="navbar-userdetail">
        <Menu
          className="menu"
          shadow="lg"
          trigger="hover"
          position="top-start"
          offset={25}
          openDelay={100}
          closeDelay={500}
        >
          <Menu.Target>
            <Paper className="user-profile">
              <Image
                className="user-img"
                height={30}
                width={30}
                src={userAvtarResult.href}
              />
              {username}
            </Paper>
          </Menu.Target>

          <Menu.Dropdown className="menu-dropdown">
            <Paper className="menu-items">
              <EditIcon className="menu-icon" fontSize="small" />
              <Text
                className="menu-text"
                component={Link}
                varient="link"
                to="change-username"
              >
                Change Username
              </Text>
            </Paper>

            <Paper className="menu-items">
              <EmailIcon className="menu-icon" fontSize="small" />
              <Text
                className="menu-text"
                component={Link}
                varient="link"
                to="change-email"
              >
                Change Email
              </Text>
            </Paper>

            <Paper className="menu-items">
              <PasswordIcon className="menu-icon" fontSize="small" />
              <Text
                className="menu-text"
                component={Link}
                varient="link"
                to="change-password"
              >
                Change Password
              </Text>
            </Paper>

            <Paper className="menu-items">
              <PowerSettingsNewIcon  className="menu-icon" fontSize="small" />
              <Text className="menu-text" onClick={userSignOut}>
                Sign Out
              </Text>
            </Paper>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
}
