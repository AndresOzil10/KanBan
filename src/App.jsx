import { HashRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./Screens/Home"
import Configuration from "./Screens/Configuration"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App