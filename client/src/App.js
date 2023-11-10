import './App.css';
import { io } from "socket.io-client";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL);
    console.log(process.env.REACT_APP_SERVER_URL)
    socket.on("connect", () => {
      console.log("connected");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">

    </div>
  );
}

export default App;
