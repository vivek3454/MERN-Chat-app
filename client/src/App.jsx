import { Toaster } from "react-hot-toast";
import Routes from "./routes/Routes";

const App = () => {
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
