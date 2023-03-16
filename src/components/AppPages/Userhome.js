import { Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Userhome = () => {
  const navigate = useNavigate();

  const showTodos = () => {
    navigate("/users/todohome");
  };

  const showContacts = () => {
    navigate("/users/contact-home");
  };

  return (
    <div className="main-div">
      <Group className="main-app-btn">
        <Button
          className="app-btn"
          size="md"
          variant="gradient"
          gradient={{ from: "teal", to: "blue" }}
          onClick={showTodos}
        >
          Todos
        </Button>

        <Button
          className="app-btn"
          size="md"
          variant="gradient"
          gradient={{ from: "teal", to: "blue" }}
          onClick={showContacts}
        >
          Contact Book
        </Button>
      </Group>
    </div>
  );
};

export default Userhome;
