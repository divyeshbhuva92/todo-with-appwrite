import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../../appwriteConfig";

function DeleteUser() {
  const navigate = useNavigate();

  const [visible, { toggle }] = useDisclosure(false);

  const [userEmail, setUserEmail] = useState("");
  const [userEmailErr, setUserEmailErr] = useState("");

  const [userPassword, setUserPassword] = useState("");
  const [userPasswordErr, setUserPasswordErr] = useState("");

  const [isEmailUpdated, setIsEmailUpdated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userEmail === "") {
      setUserEmailErr("Email should not be empty.");
    } else {
      setUserEmailErr("");
    }

    if (userPassword === "" && userPassword.length < 8) {
      setUserPasswordErr("Password must be at least 8 characters.");
    } else {
      setUserPasswordErr("");
    }

    // ----------------------------- update user Email -----------------------------

    const updateUserEmail = account.updateEmail(userEmail, userPassword);

    updateUserEmail
      .then(function (response) {
        setIsEmailUpdated(true);
        // console.log(response);
      })
      .then(async function () {
        await account.deleteSession("current");
        showNotification({
          autoClose: 4000,
          title: "Email",
          message: "Email has been updated successfully!",
        });
        navigate("/");
      })
      .catch(function (error) {
        if (error.message === 'Missing required parameter: "email"') {
          setUserEmailErr("Email should not be empty.");
        } else if (
          error.message === "Invalid email: Value must be a valid email address"
        ) {
          setUserEmailErr("Please enter a valid email address.");
        } else if (
          error.message === 'Missing required parameter: "password"' ||
          error.message ===
            "Invalid password: Password must be at least 8 characters"
        ) {
          setUserPasswordErr("Password must be at least 8 characters.");
        }
        if (
          error.message ===
          "Invalid credentials. Please check the email and password."
        ) {
          setUserPasswordErr("Invalid Password");
        }
        console.log(error.message);
      });
  };

  return (
    <div className="user-detail-container">
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form>
          <div className="Headers">Update Email</div>

          <div className="add-email">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Enter your email here"
              title="Email"
              error={userEmailErr}
              onFocus={() => setUserEmailErr("")}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
            />
          </div>

          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Enter your password here"
            visible={visible}
            onVisibilityChange={toggle}
            // value={userPassword}
            error={userPasswordErr}
            onFocus={() => setUserPasswordErr("")}
            onChange={(e) => {
              setUserPassword(e.target.value);
            }}
          />

          <Group position="center" mt="xs">
            <Button size="xs" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  );
}

export default DeleteUser;
