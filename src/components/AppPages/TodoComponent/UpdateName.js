import { Box, Button, Group, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../../appwriteConfig";

function DeleteUser() {
  const navigate = useNavigate();

  const [currentUserName, setCurrentUserName] = useState("");
  const [userNameErr, setUserNameErr] = useState("");

  useEffect(() => {
    const getCurrentUserDetails = account.get();
    getCurrentUserDetails.then(
      (response) => {
        setCurrentUserName(response.name);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentUserName === "") {
      setUserNameErr("Name should not be empty.");
    } else {
      setUserNameErr("");
    }

    // ----------------------------- update user Name -----------------------------

    const updateUserName = account.updateName(currentUserName);

    updateUserName
      .then(function (response) {
        // console.log(response);
      })
      .then(function () {
        showNotification({
          autoClose: 4000,
          title: "Username",
          message: "Username has been updated successfully!",
        });
        navigate("/users/todohome");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="user-detail-container">
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form>
          <div className="Headers">Update Username</div>
          <div className="add-title">
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Enter your name here"
              title="Name"
              value={currentUserName}
              error={userNameErr}
              onFocus={() => setUserNameErr("")}
              onChange={(e) => {
                setCurrentUserName(e.target.value);
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
