import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://financehelper-5mpy.onrender.com/api/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login"); // Programmatic navigation
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
