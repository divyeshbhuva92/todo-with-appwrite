import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../../appwriteConfig";

function DeleteUser() {
  const [visible, { toggle }] = useDisclosure(false);

  // const [currentUserDetails, setCurrentUserDetails] = useState();
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState();

  useEffect(() => {
    const getCurrentUserDetails = account.get();
    getCurrentUserDetails.then(
      (response) => {
        console.log(response);
        setCurrentUserName(response.name);
        setCurrentUserEmail(response.email);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const handleSubmit = () => {};

  return (
    <div className="delete-user-container">
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form>
          <div className="Headers">Delete User Account</div>
          <div className="add-title">
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Enter your name here"
              title="Name"
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />

            <TextInput
              withAsterisk
              label="Email"
              placeholder="Enter your email here"
              title="Email"
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />

            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Enter your password here"
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
          </div>

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
