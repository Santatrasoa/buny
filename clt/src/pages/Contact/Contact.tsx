export default function Contact() {
  return (
    <>
      {/* ── ct-image: breadcrumb banner ───────────────────────────── */}
      {/* ct-image: flex, w-full, relative */}
      <section className="flex w-full relative">
        <div className="w-full h-[50%] absolute flex justify-center items-center flex-col">
          <h1 className="text-[50px] font-light">Contact</h1>
          <p className="text-[20px] py-[20px]">
            <a href="/" className="no-underline text-black">
              Home
            </a>{" "}
            &gt; contact
          </p>
        </div>
        <img
          src="/img/background/bg-breadcrumb.jpg"
          alt=""
          className="w-full"
        />
      </section>

      <main className="w-full font-mono">
        {/* contact-info: flex, w-full */}
        <section className="w-full flex flex-col md:flex-row">
          {/* form: w-70% */}
          <form action="" className="w-full md:w-[70%]">
            {/* .form: flex, space-around, p-[20px] */}
            <section className="p-[20px] flex flex-col md:flex-row justify-around">
              {/* ct-inpt */}
              <div className="flex flex-col text-[15px]">
                <label className="pb-[10px] pt-[10px]">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name *"
                  className="text-[15px] py-[15px] px-[15px] outline-none border border-[#e5e4e5] rounded-[100px] transition-all duration-500 focus:border-black font-mono"
                />
              </div>
              <div className="flex flex-col text-[15px]">
                <label className="pb-[10px] pt-[10px]">Email</label>
                <input
                  type="text"
                  id="email"
                  placeholder="Email address *"
                  className="text-[15px] py-[15px] px-[15px] outline-none border border-[#e5e4e5] rounded-[100px] transition-all duration-500 focus:border-black font-mono"
                />
              </div>
              <div className="flex flex-col text-[15px]">
                <label className="pb-[10px] pt-[10px]">Phone</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Number Phone"
                  className="text-[15px] py-[15px] px-[15px] outline-none border border-[#e5e4e5] rounded-[100px] transition-all duration-500 focus:border-black font-mono"
                />
              </div>
            </section>

            {/* ct-textarea: mt-[10px], ml-[120px] */}
            <div className="flex flex-col text-[15px] mt-[10px] ml-[20px] md:ml-[120px]">
              <label htmlFor="message" className="pb-[10px] pt-[10px]">
                Your message
              </label>
              <textarea
                id="message"
                cols={30}
                rows={10}
                placeholder="Message or Comment *"
                className="text-[15px] p-[20px] resize-none w-full outline-none border border-[#e5e4e5] rounded-[30px] transition-all duration-500 focus:border-black font-mono placeholder-black placeholder-opacity-50"
              />
            </div>

            {/* button: ml-[120px], mt-[30px] */}
            <input
              className="bg-[#719378] text-white text-[12px] font-bold leading-[33px] px-[52px] py-[10px] rounded-[25px] mt-[30px] ml-[20px] md:ml-[120px] border-0 cursor-pointer"
              type="button"
              value="Send Message"
            />
          </form>

          {/* info: w-30%, p-[50px] */}
          <section className="w-full md:w-[30%] p-[50px]">
            <div className="p-[30px] border-b border-[#e5e4e5]">
              <h1 className="font-light text-[25px] pb-[10px]">Address</h1>
              <p className="text-[15px] opacity-50">
                14 LE Gounlburn St, Sydney 1198NSA
              </p>
            </div>
            <div className="p-[30px] border-b border-[#e5e4e5]">
              <h1 className="font-light text-[25px] pb-[10px]">Phone</h1>
              <p className="text-[15px] opacity-50">(+089) 19918989</p>
            </div>
            <div className="p-[30px] border-b border-[#e5e4e5]">
              <h1 className="font-light text-[25px] pb-[10px]">Email</h1>
              <p className="text-[15px] opacity-50">support@buny.com</p>
            </div>
            <div className="p-[30px] border-b border-[#e5e4e5]">
              <h1 className="font-light text-[25px] pb-[10px]">Opening Time</h1>
              <p className="text-[15px] opacity-50">
                8:00Am – 10:00Pm, Sunday Close
              </p>
            </div>
            <div className="p-[30px] border-b border-[#e5e4e5]">
              <h1 className="font-light text-[25px] pb-[10px]">Follow Us On</h1>
              <p></p>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
