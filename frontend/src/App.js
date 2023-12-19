import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import ChatsPage from "./Pages/ChatsPage/ChatsPage";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<HomePage></HomePage>}></Route>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route element={<ProtectedRoute></ProtectedRoute>}>
          <Route path="/chats" element={<ChatsPage></ChatsPage>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
