import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function LightDarkMode() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div>
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "dark"}
        onClick={() => toggleColorScheme()}
        title="Swith Theme"
      >
        {dark ? <LightModeIcon size={18} /> : <DarkModeIcon size={18} />}
      </ActionIcon>
    </div>
  );
}
