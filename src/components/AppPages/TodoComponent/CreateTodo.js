import { Box, Button, Group, Textarea, TextInput } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { account, databases } from "../../../appwriteConfig";
import { useNavigate } from "react-router-dom";

export default function CreateTodo() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [descErr, setDescErr] = useState("");

  const [userID, setUserID] = useState("");

  useEffect(() => {
    const getUser = account.get();
    getUser.then(
      function (response) {
        // console.log(response.$id);
        setUserID(response.$id);
      },
      function (error) {
        console.log(error.message);
        // setReloginError("redirect to login");
      }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title === "") {
      setTitleErr("Title should not be empty.");
    } else {
      setTitleErr("");
    }
    if (description === "" || description.length < 10) {
      setDescErr("Description should atleast 10 character long.");
    } else {
      setDescErr("");
    }

    if (title !== "" && description.length >= 10) {
      const newTodo = databases.createDocument(
        "6409d0710846c3cefc3c",
        "6409d08a12c042ab6d80",
        uuidv4(),
        {
          user_id: userID,
          title: title,
          description: description,
        }
      );

      newTodo.then((res) => {
        // console.log(res);
      });
      setTimeout(() => {
        navigate("/users/todohome");
      }, 400);
    }
  };

  return (
    <div className="todoinputs">
      <div className="add-list">
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form>
            <div className="Headers">Create New Todo</div>
            <div className="add-title">
              <TextInput
                mb="xs"
                withAsterisk
                label="Title"
                placeholder="Enter title here..."
                title="Title"
                error={titleErr}
                onFocus={() => setTitleErr("")}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="add-details">
              <Textarea
                mb="xs"
                withAsterisk
                label="Description"
                placeholder="Enter description here..."
                title="Description"
                error={descErr}
                onFocus={() => setDescErr("")}
                onChange={(e) => setDescription(e.target.value)}
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
    </div>
  );
}
