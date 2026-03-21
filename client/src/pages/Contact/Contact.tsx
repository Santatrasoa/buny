import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="ct-image">
        <div>
          <h1>Contact</h1>
          <p>
            <a href="/" className="a">
              Home
            </a>{" "}
            {">"} contact
          </p>
        </div>
        <img src="/img/background/bg-breadcrumb.jpg" alt="" />
      </section>

      <main>
        <section className="contact-info">
          <form action="" onSubmit={handleSubmit}>
            {sent && (
              <p
                style={{
                  color: "#f7c6d6",
                  padding: "0.5rem 1rem",
                  marginBottom: "1rem",
                }}
              >
                ✓ Message sent successfully!
              </p>
            )}
            <section className="form">
              <div className="ct-inpt">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name *"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>
              <div className="ct-inpt">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
              <div className="ct-inpt">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="Number Phone"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>
            </section>

            <div className="ct-inpt ct-textarea">
              <label htmlFor="message">Your message</label>
              <textarea
                id="message"
                cols={30}
                rows={10}
                placeholder="Message or Comment *"
                value={form.message}
                onChange={set("message")}
                required
              />
            </div>
            <input className="button" type="submit" value="Send Message" />
          </form>

          <section className="info">
            <div className="ct-info">
              <h1>Address</h1>
              <p>14 LE Gounlburn St, Sydney 1198NSA</p>
            </div>
            <div className="ct-info">
              <h1>Phone</h1>
              <p>(+089) 19918989</p>
            </div>
            <div className="ct-info">
              <h1>Email</h1>
              <p>support@buny.com</p>
            </div>
            <div className="ct-info">
              <h1>Opening Time</h1>
              <p>8:00Am – 10:00Pm, Sunday Close</p>
            </div>
            <div className="ct-info">
              <h1>Follow Us On</h1>
              <p></p>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
