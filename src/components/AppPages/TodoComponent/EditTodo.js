import { Box, Button, Group, Textarea, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { databases } from "../../../appwriteConfig";

export default function EditTodo() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTodoArr = location.pathname.split("/");
  const currentTodoID = currentTodoArr[currentTodoArr.length - 1];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [descErr, setDescErr] = useState("");

  // get the current todo details ---------------------------------
  useEffect(() => {
    const getData = databases.getDocument(
      "63f88d27c0c0c0e90da0",
      "63f88d3cd3f574472792",
      currentTodoID
    );

    getData.then(
      (response) => {
        // console.log(response);
        setTitle(response.title);
        setDescription(response.description);
      },
      (error) => {
        console.log(error.message);
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
      const newTodo = databases.updateDocument(
        "63f88d27c0c0c0e90da0",
        "63f88d3cd3f574472792",
        currentTodoID,
        {
          title: title,
          description: description,
        }
      );

      newTodo.then(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log(err.message);
        }
      );
      setTimeout(() => {
        navigate("/users/home");
      }, 400);
    }
  };

  return (
    <div className="todoinput-removeall">
      <div className="add-list">
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <div className="Headers">Edit Todo</div>
          <div className="add-title">
            <TextInput
              mb="xs"
              withAsterisk
              label="Title"
              placeholder="Enter title here..."
              title="Title"
              error={titleErr}
              onFocus={() => setTitleErr("")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="add-details">
            <Textarea
              mb="xs"
              withAsterisk
              label="Details"
              placeholder="Enter Details here..."
              title="Details"
              error={descErr}
              onFocus={() => setDescErr("")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Group position="center" mt="xs">
            <Button size="xs" onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </Box>
      </div>
    </div>
  );
}
