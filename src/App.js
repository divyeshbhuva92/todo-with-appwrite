import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import LoginPage from "./components/login/LoginPage";
import Home from "./components/Home";
import AddUser from "./components/login/AddUser";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  // --------- theme stored in local storage ------------------------------
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "light",
  });

  // ----------------------- toggle themes --------------------------------
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <Router>
      <div className="App">
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
          >
            <NotificationsProvider />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<AddUser />} />
              <Route path="/users/*" element={<Home />} />
            </Routes>
          </MantineProvider>
        </ColorSchemeProvider>
      </div>
    </Router>
  );
}

export default App;
