import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="w-full">
      <div className="flex flex-col border-t border-gray-200 pt-8">
        <div className="w-full flex flex-wrap items-start justify-between py-20 px-6 md:flex-nowrap md:items-center md:justify-between">
          <section className="w-full md:w-1/4 flex items-center justify-center mb-6 md:mb-0">
            <img
              className="w-24 h-12 object-contain"
              src="/icon/logo.png"
              alt="Buny"
            />
          </section>

          <section className="w-full md:w-1/4 flex flex-col items-center md:items-start text-sm text-gray-700">
            <p className="opacity-50">Gyan Singh Market,</p>
            <p className="opacity-50">Sector 22</p>
            <p className="opacity-50">Noida, UP 201301</p>
            <div className="mt-4" />
            <p className="opacity-50">Call us now: +91-9871833367</p>
            <p className="opacity-50">Email: demoeuma@gmail.com</p>
          </section>

          <section className="hidden md:flex md:w-1/4 items-center justify-center">
            <img src="/icon/line.png" alt="" />
          </section>

          <section className="w-full md:w-1/4 flex items-center justify-center">
            <form
              className="w-full max-w-md flex items-center justify-between border-b-4 border-gray-200 pb-2"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                id="subscribe"
                placeholder="Email ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 text-sm outline-none border-none px-2 py-2"
              />
              <button
                type="submit"
                className="text-sm px-3 py-2 bg-transparent"
              >
                Subscribe
              </button>
            </form>
          </section>
        </div>

        <div className="w-full flex items-center justify-around py-20 px-6 flex-wrap md:flex-nowrap">
          <p className="text-sm">© 2024 Buny, All Rights Reserved</p>
          <img src="/icon/payment.png" alt="" />
        </div>
      </div>
    </footer>
  );
}
