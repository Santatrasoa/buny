import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subOk, setSubOk] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubOk(true);
    setEmail("");
    setTimeout(() => setSubOk(false), 3000);
  };

  return (
    <footer className="bg-white border-t border-gray-100 font-mono">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + tagline */}
        <div className="flex flex-col gap-4">
          <Link to="/">
            <img
              src="/icon/logo.png"
              alt="Buny"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = "none";
                const el = document.createElement("span");
                el.textContent = "BUNY";
                el.className = "text-2xl font-bold text-[#719378]";
                img.parentNode?.insertBefore(el, img);
              }}
            />
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Soft, safe and stylish clothes for your little ones.
            Made with love for newborns &amp; kids.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: <Instagram size={16} /> },
              { icon: <Facebook  size={16} /> },
              { icon: <Twitter   size={16} /> },
            ].map((s, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#719378] hover:text-[#719378] hover:bg-green-50 transition-colors no-underline"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Liens rapides */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Quick Links
          </h4>
          {[
            { label: "Home",     to: "/" },
            { label: "Shop",     to: "/shop" },
            { label: "Contact",  to: "/contact" },
            { label: "Login",    to: "/login" },
            { label: "Register", to: "/register" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-gray-500 hover:text-[#719378] no-underline transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Coordonnées */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Contact Us
          </h4>
          {[
            { icon: <MapPin size={14} />, text: "Gyan Singh Market, Sector 22,\nNoida UP 201301" },
            { icon: <Phone  size={14} />, text: "+91-9871833367" },
            { icon: <Mail   size={14} />, text: "support@buny.com" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-[#719378] mt-0.5 flex-shrink-0">{item.icon}</span>
              <span className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Newsletter
          </h4>
          <p className="text-sm text-gray-400">
            Subscribe for new arrivals &amp; exclusive offers.
          </p>
          {subOk ? (
            <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              ✅ Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden focus-within:border-[#719378] transition-colors">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent border-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-bold text-white bg-[#719378] hover:opacity-85 transition-opacity border-none cursor-pointer flex-shrink-0"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Buny Baby Store. All rights reserved.
          </p>
          <img
            src="/icon/payment.png"
            alt="Payment methods"
            className="h-6 object-contain opacity-50"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="flex gap-4 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600 no-underline">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 no-underline">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
