import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material" ;
import { Routes, Route } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar'
import Dashboard from './scenes/dashboard';
import Users from './scenes/admin/users';
// import Geography from './scenes/geography';
// import Calendar from './scenes/calendar';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        <div className="app">
          <Sidebar />
          <main className="content" style={{ flex: 1, overflowX: 'hidden'}}>
            <Topbar/>
            <Routes>
              <Route path ="/" element={<Dashboard />} />
              <Route path ="/users" element={<Users />} />
              {/* <Route path ="/geography" element={<Geography />} /> */}
              {/* <Route path ="/calendar" element={<Calendar />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
