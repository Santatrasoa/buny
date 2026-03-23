import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus } from "lucide-react";
import { authApi } from "../../api/api";

type FormState = {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  password:  string;
  confirm:   string;
};

export default function Register() {
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "",
  });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6)       { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await authApi.register({
        email:     form.email,
        password:  form.password,
        firstName: form.firstName || undefined,
        lastName:  form.lastName  || undefined,
        phone:     form.phone     || undefined,
        roles:     ["ROLE_USER"],
      });
      navigate("/login");
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── Helper pour champ avec icône ── */
  const Field = ({
    label, icon, type = "text", placeholder, value, onChange, required = false,
    rightEl,
  }: {
    label: string; icon: React.ReactNode; type?: string; placeholder: string;
    value: string; onChange: React.ChangeEventHandler<HTMLInputElement>;
    required?: boolean; rightEl?: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 outline-none text-sm transition-colors focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/10 bg-gray-50"
        />
        {rightEl && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</span>
        )}
      </div>
    </div>
  );

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
          <h1 className="text-4xl font-light">Register</h1>
          <p className="text-sm opacity-80">
            <Link to="/" className="text-white no-underline hover:underline">Home</Link>
            {" "}&gt;{" "}Register
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="w-full flex justify-center py-16 px-4 bg-gray-50">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <UserPlus size={24} className="text-[#719378]" />
              </div>
              <h2 className="text-2xl font-light text-gray-800">Create an account</h2>
              <p className="text-sm text-gray-400 mt-1">Join the Buny family today</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* First & Last name */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First Name"
                  icon={<User size={16} />}
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set("firstName")}
                />
                <Field
                  label="Last Name"
                  icon={<User size={16} />}
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
              </div>

              {/* Phone */}
              <Field
                label="Phone (optional)"
                icon={<Phone size={16} />}
                type="tel"
                placeholder="+261 34 …"
                value={form.phone}
                onChange={set("phone")}
              />

              {/* Email */}
              <Field
                label="Email address *"
                icon={<Mail size={16} />}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                required
              />

              {/* Password */}
              <Field
                label="Password *"
                icon={<Lock size={16} />}
                type={showPwd ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set("password")}
                required
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer p-0.5"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Confirm */}
              <Field
                label="Confirm Password *"
                icon={<Lock size={16} />}
                type={showConf ? "text" : "password"}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={set("confirm")}
                required
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowConf((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer p-0.5"
                  >
                    {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Password strength bar */}
              {form.password && (
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        form.password.length >= i * 4
                          ? i === 1 ? "bg-red-400"
                          : i === 2 ? "bg-yellow-400"
                          : "bg-[#719378]"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">
                    {form.password.length < 4 ? "Weak" : form.password.length < 8 ? "Fair" : "Strong"}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-full bg-[#719378] text-white text-sm font-bold hover:opacity-85 transition-opacity disabled:opacity-60 cursor-pointer border-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[#719378] font-semibold no-underline hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
