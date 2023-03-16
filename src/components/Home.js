import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Loader,
} from "@mantine/core";
import { account } from "../appwriteConfig";
import LightDarkMode from "./LightDarkMode";
import NavbarContent from "./NavbarContent";

// ----------------------------Contacts---------------------------------
import CreateContact from "./AppPages/ContactComponent/CreateContact";
import EditContact from "./AppPages/ContactComponent/EditContact";
import ViewContact from "./AppPages/ContactComponent/ViewContact";

// ------------------------------todos----------------------------------
import Userhome from "./AppPages/Userhome";
import TodoHome from "./AppPages/TodoComponent/TodoHome";
import CreateTodo from "./AppPages/TodoComponent/CreateTodo";
import EditTodo from "./AppPages/TodoComponent/EditTodo";
import UpdateName from "./AppPages/TodoComponent/UpdateName";
import UpdateEmail from "./AppPages/TodoComponent/UpdateEmail";
import UpdatePwd from "./AppPages/TodoComponent/UpdatePwd";
import ContactHome from "./AppPages/ContactComponent/ContactHome";

export default function Home() {
  const { todoID } = useParams();
  const { contactID } = useParams();

  const theme = useMantineTheme();
  const location = useLocation();

  const [opened, setOpened] = useState(false);

  const [isLoading, setIsLoading] = useState();
  const [reloginError, setReloginError] = useState();

  const [userDetails, setUserDetails] = useState();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setIsLoading(true);

    const getData = account.get();

    getData
      .then(
        (response) => {
          setUserDetails(response);
          setUsername(response.name.toUpperCase());
        },
        (error) => {
          setReloginError("redirect to login");
        }
      )
      .catch((error) => {
        console.log(error);
      });

    setIsLoading(false);
  }, [location.pathname]);

  if (isLoading === true) {
    <Loader variant="bars" />;
  } else {
    if (userDetails) {
      return (
        <div>
          <>
            <div className="appshell-container">
              <AppShell
                styles={{
                  main: {
                    background:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
                  },
                }}
                header={
                  <Header height={{ base: 50, md: 60 }}>
                    <div
                      className="HeaderContainer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                        <Burger
                          opened={opened}
                          onClick={() => setOpened((o) => !o)}
                          size="sm"
                          color={theme.colors.gray[6]}
                          mr="sm"
                        />
                      </MediaQuery>

                      <Text>Hello {username}</Text>
                      <div className="swithTheme-btn">
                        <LightDarkMode />
                      </div>
                    </div>
                  </Header>
                }
                navbarOffsetBreakpoint="sm"
                navbar={
                  <Navbar
                    hiddenBreakpoint="sm"
                    hidden={!opened}
                    width={{ sm: 220, lg: 250 }}
                  >
                    <NavbarContent />
                  </Navbar>
                }
              >
                <Routes>
                  <Route path="home" element={<Userhome />} />

                  <Route
                    path="todohome"
                    element={<TodoHome todoid={todoID} />}
                  />
                  <Route path="create-todo" element={<CreateTodo />} />
                  <Route path="edit-todo/:todoID" element={<EditTodo />} />

                  <Route
                    path="contact-home"
                    element={<ContactHome contactid={contactID} />}
                  />
                  <Route path="create-contact" element={<CreateContact />} />
                  <Route
                    path="edit-contact/:contactID"
                    element={<EditContact />}
                  />
                  <Route path="/:contactID" element={<ViewContact />} />

                  <Route path="change-username" element={<UpdateName />} />
                  <Route path="change-email" element={<UpdateEmail />} />
                  <Route path="change-password" element={<UpdatePwd />} />
                </Routes>
              </AppShell>
            </div>
          </>
        </div>
      );
    } else if (reloginError === "redirect to login") {
      return (
        <Text>
          Please <Link to="/">login</Link> to continue.
        </Text>
      );
    }
  }
}
