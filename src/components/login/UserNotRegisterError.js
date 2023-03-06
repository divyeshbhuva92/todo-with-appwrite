import { Button, Group, Modal, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function UserNotRegisterError({
  openedErroModel,
  setOpenedErroModel,
}) {
  const theme = useMantineTheme();

  const navigate = useNavigate();

  return (
    <div>
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
        Please Login To see details.
        <Group position="right" mt="md">
          <Button onClick={() => navigate("/")}>Log In</Button>
        </Group>
      </Modal>
    </div>
  );
}
