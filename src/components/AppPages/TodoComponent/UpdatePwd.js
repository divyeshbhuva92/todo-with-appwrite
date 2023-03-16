import { Button, Group, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../../appwriteConfig";

export default function UpdateUserPwd() {
  const navigate = useNavigate();
  const [visible, { toggle }] = useDisclosure(false);

  const [oldPwd, setOldPwd] = useState("");
  const [oldPwdErr, setOldPwdErr] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwdErr, setNewPwdErr] = useState("");

  const [isPwdChange, setIsPwdChange] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (oldPwd === "" || oldPwd.length < 8) {
      setOldPwdErr("Password must be at least 8 characters.");
    } else {
      setOldPwdErr("");
    }

    if (newPwd === "" || newPwd.length < 8) {
      setNewPwdErr("Password must be at least 8 characters.");
    } else {
      setNewPwdErr("");
    }

    const updatePwd = account.updatePassword(newPwd, oldPwd);

    updatePwd
      .then(function (response) {
        setIsPwdChange(true);
        // console.log(response);
      })
      .then(async function () {
        await account.deleteSession("current");
        showNotification({
          autoClose: 4000,
          title: "Password",
          message: "Password has been updated successfully!",
        });
        navigate("/");
      })
      .catch(function (error) {
        if (
          error.message ===
          "Invalid credentials. Please check the email and password."
        ) {
          setOldPwdErr("Invalid password.");
        }
        console.log(error.message);
      });
  };

  return (
    <div className="change-pwd-container">
      <div>
        <div className="Headers">Update Password</div>

        <PasswordInput
          withAsterisk
          label="Old password"
          placeholder="Enter old password here"
          visible={visible}
          onVisibilityChange={toggle}
          // value={userPassword}
          error={oldPwdErr}
          onFocus={() => setOldPwdErr("")}
          onChange={(e) => {
            // console.log(e.target.value);
            setOldPwd(e.target.value);
          }}
        />

        <PasswordInput
          withAsterisk
          label="New password"
          placeholder="Enter New password here"
          visible={visible}
          onVisibilityChange={toggle}
          // value={userPassword}
          error={newPwdErr}
          onFocus={() => setNewPwdErr("")}
          onChange={(e) => {
            // console.log(e.target.value);
            setNewPwd(e.target.value);
          }}
        />

        <Group position="center" mt="xs">
          <Button size="xs" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Group>
      </div>
    </div>
  );
}
