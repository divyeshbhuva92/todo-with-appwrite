import { Box, Button, Group, Textarea, TextInput } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { databases } from "../../../appwriteConfig";
import { useNavigate } from "react-router-dom";

export default function CreateTodo() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [descErr, setDescErr] = useState("");

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
        "63f88d27c0c0c0e90da0",
        "63f88d3cd3f574472792",
        uuidv4(),
        {
          title: title,
          description: description,
        }
      );

      // newTodo.then((res) => console.log(res));
      setTimeout(() => {
        navigate("/users/home");
      }, 400);
    }
  };

  return (
    <div className="todoinput-removeall">
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
