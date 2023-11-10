import './App.css';
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getStatus().then((data) => {
      console.log(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">

    </div>
  );
}

export default App;
