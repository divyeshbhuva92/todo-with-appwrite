import { Image, Menu, Paper, Text } from "@mantine/core";
import {
  IconAddressBook,
  IconBallpen,
  IconEdit,
  IconHome,
  IconMail,
  IconNote,
  IconPassword,
  IconPower,
  IconTextPlus,
} from "@tabler/icons";
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
          <IconHome size={15} /> Home
        </Paper>

        <Paper className="navbar-options-titles">
          <IconNote size={15} /> Todos
        </Paper>

        <Paper
          className="navbar-options"
          component={Link}
          varient="link"
          to="create-todo"
        >
          <IconEdit size={15} /> Add Todo
        </Paper>

        <Paper className="navbar-options-titles">
          <IconAddressBook size={15} /> Contact Book
        </Paper>

        <Paper
          className="navbar-options"
          component={Link}
          varient="link"
          to="create-contact"
        >
          <IconTextPlus size={15} /> Add Contact
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
          closeDelay={500000}
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
              <IconBallpen className="menu-icon" size={14} />
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
              <IconMail className="menu-icon" size={14} />
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
              <IconPassword className="menu-icon" size={14} />
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
              <IconPower className="menu-icon" size={14} />
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
