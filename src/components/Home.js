import { useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Image,
  Loader,
} from "@mantine/core";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { account, userAvtarResult } from "../appwriteConfig";
import LightDarkMode from "./LightDarkMode";
import Userhome from "./AppPages/Userhome";
import CreateTodo from "./AppPages/TodoComponent/CreateTodo";
import EditTodo from "./AppPages/TodoComponent/EditTodo";
import UpdateName from "./AppPages/TodoComponent/UpdateName";
import UpdateEmail from "./AppPages/TodoComponent/UpdateEmail";
import UpdatePwd from "./AppPages/TodoComponent/UpdatePwd";

export default function Home() {
  const { todoID } = useParams;
  const navigate = useNavigate();
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

    getData.then(
      function (response) {
        setUserDetails(response);
        // console.log(response);
        setUsername(response.name.toUpperCase());
      },
      function (error) {
        // console.log(error.message);
        setReloginError("redirect to login");
      }
    );

    setIsLoading(false);
  }, [location.pathname]);

  const userSignOut = async () => {
    try {
      await account.deleteSession("current");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  userAvtarResult.username = username;

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
                  <Header height={{ base: 50, md: 60 }} p="sm">
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
                    p="sm"
                    hiddenBreakpoint="sm"
                    hidden={!opened}
                    width={{ sm: 200, lg: 250 }}
                  >
                    <div className="home-navbar">
                      <div className="navbar-content">
                        <Text component={Link} varient="link" to="home">
                          Home
                        </Text>
                        <Text component={Link} varient="link" to="create-todo">
                          Create Todo
                        </Text>
                        <Text component={Link} varient="link" to="username">
                          Change Username
                        </Text>
                        <Text component={Link} varient="link" to="userdetails">
                          Change User Email
                        </Text>
                        <Text
                          component={Link}
                          varient="link"
                          to="change-password"
                        >
                          Change Password
                        </Text>

                        <Text onClick={userSignOut}>Sign Out</Text>
                      </div>
                      <div className="navbar-userdetail">
                        <div className="user-profile">
                          <div className="user-img">
                            <Image src={userAvtarResult.href} />
                          </div>
                          <p>{username}</p>
                        </div>
                      </div>
                    </div>
                  </Navbar>
                }
              >
                <Routes>
                  <Route path="home" element={<Userhome todoid={todoID} />} />
                  <Route path="create-todo" element={<CreateTodo />} />
                  <Route path="edit-todo/:todoID" element={<EditTodo />} />
                  <Route path="username" element={<UpdateName />} />
                  <Route path="userdetails" element={<UpdateEmail />} />
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
