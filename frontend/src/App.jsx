import './App.css'
import DetailRegistration from './pages/DetailRegistration'

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<DetailRegistration />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
