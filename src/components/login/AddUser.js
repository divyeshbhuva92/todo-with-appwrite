import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { account } from "../../appwriteConfig";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AddUser() {
  const navigate = useNavigate();

  const [visible, { toggle }] = useDisclosure(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  // Sign up
  const signupUser = async (e) => {
    e.preventDefault();

    const newuser = account.create(
      uuidv4(),
      user.email,
      user.password,
      user.name,
      user.avatar
    );

    newuser
      .then(() => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="createUser-container">
      <div className="addUserdetails-container">
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form method="POST">
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Enter your name here"
              title="Name"
              onChange={(e) => {
                setUser({ ...user, name: e.target.value });
              }}
            />

            <TextInput
              withAsterisk
              label="Email"
              placeholder="Enter your email here"
              title="Email"
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
            />

            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Enter your password here"
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />

            {/* <TextInput
              withAsterisk
              label="Avatar"
              placeholder="Enter your avatar url here"
              title="Avatar url"
              onChange={(e) => setUser({ ...user, avatar: e.target.value })}
            /> */}

            <Group position="right" mt="md">
              <Button size="xs" type="submit" onClick={signupUser}>
                Submit
              </Button>
            </Group>
          </form>
        </Box>
      </div>
    </div>
  );
}

export default AddUser;
