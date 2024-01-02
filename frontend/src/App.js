import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import User from "./user/pages/User";
import NewPlace from "./places/pages/NewPlace";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/places/new" element={<NewPlace />} />
      </Routes>
    </Router>
  );
}

export default App;
