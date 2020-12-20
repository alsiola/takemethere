import { useAuth0 } from "@auth0/auth0-react";
export default function Home() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={() => logout()}>Logout</button>
      ) : (
        <button onClick={loginWithRedirect}>Login</button>
      )}
    </div>
  );
}
