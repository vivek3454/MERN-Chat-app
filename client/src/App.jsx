import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";

const App = () => {

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Signup />
    </>
  );
};

export default App;
