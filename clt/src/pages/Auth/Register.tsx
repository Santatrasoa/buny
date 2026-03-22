import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/api";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        phone: form.phone || undefined,
        roles: ["ROLE_USER"],
      });
      navigate("/login");
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="ct-image">
        <div>
          <h1>Register</h1>
          <p>
            <a href="/" className="a">
              Home
            </a>{" "}
            {">"} Register
          </p>
        </div>
        <img src="/img/background/bg-breadcrumb.jpg" alt="" />
      </section>

      <main>
        <section className="contact-info" style={{ justifyContent: "center" }}>
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <h2
              style={{
                marginBottom: "1.5rem",
                fontWeight: 300,
                fontSize: "1.5rem",
              }}
            >
              Create an account
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

            <section className="form">
              <div className="ct-inpt">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set("firstName")}
                />
              </div>
              <div className="ct-inpt">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
              </div>
              <div className="ct-inpt">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>
            </section>

            <div
              className="ct-inpt ct-textarea"
              style={{ flexDirection: "column", gap: "0.5rem" }}
            >
              <label>Email *</label>
              <input
                type="email"
                placeholder="Email address *"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>
            <div
              className="ct-inpt ct-textarea"
              style={{
                flexDirection: "column",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <label>Password *</label>
              <input
                type="password"
                placeholder="Password * (min. 6 characters)"
                value={form.password}
                onChange={set("password")}
                required
              />
            </div>
            <div
              className="ct-inpt ct-textarea"
              style={{
                flexDirection: "column",
                gap: "0.5rem",
                marginTop: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <label>Confirm Password *</label>
              <input
                type="password"
                placeholder="Confirm password *"
                value={form.confirm}
                onChange={set("confirm")}
                required
              />
            </div>

            <input
              className="button"
              type="submit"
              value={loading ? "Creating..." : "Create Account"}
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
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#f7c6d6" }}>
                Login
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}
