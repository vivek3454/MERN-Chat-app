import { Toaster } from "react-hot-toast";
import Routes from "./routes/Routes";
import { useEffect, useState } from "react";
import axiosInstance from "./helpers/axiosInstance";

const App = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axiosInstance.get("/user/profile");
      setUserData(data.userData);
    })();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes />
    </>
  );
};

export default App;
