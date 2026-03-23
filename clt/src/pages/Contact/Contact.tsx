import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm]    = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent]    = useState(false);
  const [loading, setLoad] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoad(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoad(false);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const INFO = [
    { icon: <MapPin size={18} />,  title: "Address",      text: "14 Le Goulburn St, Sydney 1198NSA" },
    { icon: <Phone size={18} />,   title: "Phone",        text: "(+089) 19918989" },
    { icon: <Mail size={18} />,    title: "Email",        text: "support@buny.com" },
    { icon: <Clock size={18} />,   title: "Opening Time", text: "8:00 AM – 10:00 PM (Sunday Closed)" },
  ];

  return (
    <>
      <section className="relative w-full overflow-hidden">
        <img
          src="/img/background/bg-breadcrumb.jpg"
          alt=""
          className="w-full h-52 object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <h1 className="text-5xl font-light drop-shadow">Contact</h1>
          <p className="text-base opacity-80">
            <Link to="/" className="text-white no-underline hover:underline">Home</Link>
            {" "}&gt;{" "}Contact
          </p>
        </div>
      </section>

      <div className="flex flex-col md:flex-row font-mono">
        {/* Formulaire */}
        <div className="w-full md:w-[65%] p-8 md:p-14">
          <h2 className="text-2xl font-light text-gray-800 mb-6">Send us a message</h2>

          {sent && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              ✅ Message sent! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "name",  label: "Name *",  type: "text",  ph: "Your name",      req: true  },
                { id: "email", label: "Email *", type: "email", ph: "Email address",  req: true  },
                { id: "phone", label: "Phone",   type: "tel",   ph: "Phone number",   req: false },
              ].map((f) => (
                <div key={f.id} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    required={f.req}
                    value={form[f.id as keyof typeof form]}
                    onChange={set(f.id as keyof typeof form)}
                    className="px-4 py-3 rounded-full border border-gray-200 outline-none text-sm focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/10 bg-gray-50 font-mono transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Your message *</label>
              <textarea
                placeholder="Message or comment…"
                rows={6}
                required
                value={form.message}
                onChange={set("message")}
                className="px-5 py-4 rounded-3xl border border-gray-200 outline-none text-sm resize-none focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/10 bg-gray-50 font-mono transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="self-start flex items-center gap-2 px-10 py-3 rounded-full text-white text-sm font-bold transition-opacity disabled:opacity-60 cursor-pointer border-none bg-[#719378] hover:opacity-85"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <><Send size={14} /> Send Message</>
              )}
            </button>
          </form>
        </div>

        {/* Infos */}
        <aside className="w-full md:w-[35%] bg-gray-50 border-l border-gray-100 p-8 md:p-10 flex flex-col">
          {INFO.map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-5 border-b border-gray-200 last:border-b-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white bg-[#719378]">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.text}</p>
              </div>
            </div>
          ))}
          <div className="pt-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Follow Us</p>
            <div className="flex gap-2 flex-wrap">
              {["Instagram", "Facebook", "Twitter"].map((s) => (
                <button key={s} className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-[#719378] hover:text-[#719378] transition-colors cursor-pointer bg-white">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
