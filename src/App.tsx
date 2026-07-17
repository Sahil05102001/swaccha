import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { useAuth } from "@/features/auth/AuthContext";

function App() {
  const { user, loading } = useAuth();

  console.log(user);
  console.log(loading);
  return <RouterProvider router={router} />;
}

export default App;