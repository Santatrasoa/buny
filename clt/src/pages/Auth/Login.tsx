import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { authApi } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

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
      {/* Breadcrumb banner */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/img/background/bg-breadcrumb.jpg"
          alt=""
          className="w-full h-48 object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <h1 className="text-4xl font-light">Login</h1>
          <p className="text-sm opacity-80">
            <Link to="/" className="text-white no-underline hover:underline">Home</Link>
            {" "}&gt;{" "}Login
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="w-full flex justify-center items-start py-16 px-4 bg-gray-50 min-h-[calc(100vh-300px)]">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <LogIn size={24} className="text-[#719378]" />
              </div>
              <h2 className="text-2xl font-light text-gray-800">Welcome back</h2>
              <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none text-sm transition-colors focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/10 bg-gray-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 outline-none text-sm transition-colors focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/10 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer p-0.5"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-full bg-[#719378] text-white text-sm font-bold hover:opacity-85 transition-opacity disabled:opacity-60 cursor-pointer border-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#719378] font-semibold no-underline hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
