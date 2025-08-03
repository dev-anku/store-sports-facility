import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  async function handleLogout() {
    const result = await logout();
    if (result.success) {
      navigate('/login'); // Redirect to home page after successful login
    }
  }
  return (
    <div>Home Page!
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
