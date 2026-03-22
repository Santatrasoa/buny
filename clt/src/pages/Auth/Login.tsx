import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      login(res.token, res.user);
      navigate(res.user.roles?.includes("ROLE_ADMIN") ? "/admin" : "/");
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="ct-image">
        <div>
          <h1>Login</h1>
          <p>
            <a href="/" className="a">
              Home
            </a>{" "}
            {">"} Login
          </p>
        </div>
        <img src="/img/background/bg-breadcrumb.jpg" alt="" />
      </section>

      <main>
        <section className="contact-info" style={{ justifyContent: "center" }}>
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "450px", width: "100%" }}
          >
            <h2
              style={{
                marginBottom: "1.5rem",
                fontWeight: 300,
                fontSize: "1.5rem",
              }}
            >
              Welcome back
            </h2>

            {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </p>
            )}

            <div
              className="ct-inpt"
              style={{
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <label>Email</label>
              <input
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div
              className="ct-inpt"
              style={{
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <label>Password</label>
              <input
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <input
              className="button"
              type="submit"
              value={loading ? "Logging in..." : "Login"}
              style={{ width: "100%", opacity: loading ? 0.7 : 1 }}
            />

            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                opacity: 0.6,
                fontSize: "0.9rem",
              }}
            >
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#f7c6d6" }}>
                Register
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}
