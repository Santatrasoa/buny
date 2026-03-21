import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer className="footer-shop">
      <section className="ctn-footer">
        <section>
          <img className="buny" src="/icon/logo.png" alt="Buny" />
        </section>
        <section className="info-footer">
          <p>Gyan Singh Market,</p>
          <p>Sector 22</p>
          <p>Noida, UP 201301</p>
          <br />
          <p>Call us now: +91-9871833367</p>
          <p>Email: demoeuma@gmail.com</p>
        </section>
        <section className="removable">
          <img src="/icon/line.png" alt="" />
        </section>
        <section>
          <form className="ctn-input-mail" onSubmit={handleSubscribe}>
            <input
              type="email"
              id="subscribe"
              placeholder="Email ..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input type="submit" value="Subscribe" />
          </form>
        </section>
      </section>

      <section className="copyRight">
        <p>© 2024 Buny, All Rights Reserved</p>
        <img src="/icon/payment.png" alt="" />
      </section>
    </footer>
  )
}
