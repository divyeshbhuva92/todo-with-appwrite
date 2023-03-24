import "../../../src/App.css";
import {
  TextInput,
  Button,
  Group,
  Box,
  PasswordInput,
  Text,
  Modal,
  useMantineTheme,
} from "@mantine/core";
import LightDarkMode from "../LightDarkMode";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { account } from "../../appwriteConfig";

export default function LoginPage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [visible, { toggle }] = useDisclosure(false);

  const [openedErroModel, setOpenedErroModel] = useState(false);
  const [emailErrMessage, setEmailErrMessage] = useState("");
  const [passwordErrMessage, setPasswordErrMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();

    if (user.email === "") {
      setEmailErrMessage("Please enter email.");
    } else {
      setEmailErrMessage("");
    }
    if (user.password === "") {
      setPasswordErrMessage("Please enter password.");
      return;
    } else {
      setPasswordErrMessage("");
    }

    try {
      await account.createEmailSession(user.email, user.password);
      navigate("/users/home");
    } catch (error) {
      if (
        error.message ===
          "Invalid email: Value must be a valid email address" ||
        error.message ===
          "Invalid password: Password must be at least 8 characters" ||
        error.message ===
          "Invalid credentials. Please check the email and password."
      ) {
        setOpenedErroModel(true);
        setErrMessage("Incorrect email or password.");
      } else {
        setErrMessage("");
      }
    }

    if (errMessage !== "") {
      console.log(errMessage);
    }
  };

  return (
    <div className="login-comp">
      {openedErroModel === true ? (
        <div className="userLoginError">
          <Modal
            size="sm"
            opened={openedErroModel}
            onClose={() => setOpenedErroModel(false)}
            title="Error"
            centered
            overlayColor={
              theme.colorScheme === "dark"
                ? theme.colors.dark[9]
                : theme.colors.gray[2]
            }
            overlayOpacity={0.61}
            overlayBlur={3}
          >
            {errMessage}
          </Modal>
        </div>
      ) : null}

      <div className="swithTheme-btn">
        <LightDarkMode />
      </div>

      <div className="formBox">
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form method="POST">
            <TextInput
              className="login-input"
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              title="Email"
              error={emailErrMessage}
              onFocus={() => setEmailErrMessage("")}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
            />

            <PasswordInput
              className="login-input"
              withAsterisk
              label="Password"
              placeholder="Enter your password here"
              error={passwordErrMessage}
              onFocus={() => setPasswordErrMessage("")}
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />

            <Group position="apart" mt="md">
              <Text
                className="signup-link"
                component={Link}
                varient="link"
                to="signup"
              >
                Sign Up
              </Text>
              <Button size="xs" type="submit" onClick={loginUser}>
                Sign In
              </Button>
            </Group>
          </form>
        </Box>
      </div>
    </div>
  );
}
