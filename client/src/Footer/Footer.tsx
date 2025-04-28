import logoBuny from "../assets/logo.png"

function Footer() {
    return(
        <>
            <footer className="border-y-[1px] border-gray-300 py-11">
                <section className=" w-full text-center flex flex-col items-center justify-center gap-6 lg:justify-evenly lg:flex-row">
                    <img src={logoBuny} className="w-[110px] h-[35px]" alt="Buny" />
                    <section className="info-footer opacity-50 lg:w-1/3">
                        <p>Gyan Singh Market,</p>
                        <p>Sector 22</p>
                        <p>Noida, UP 201301</p>
                        <p>Call us now: +91-9871833367</p>
                        <p>Email: Santatraherimampionona@gmail.com</p>
                    </section>
                    <form action="" method="POST" className="flex justify-evenly lg:flex-row w-1/2 gap-2 lg:w-1/3 flex-col z-40" >
                        <input
                            type="email"
                            name=""
                            className="py-2 px-5 w-full outline-none border-[1px] rounded-4xl border-gray-400 focus:border-black transition duration-300" 
                            placeholder="Email ..."
                            required
                        />
                        <button className="cursor-pointer p-2 border-[1px] rounded-4xl bg-[#719378] text-white">Subscribe</button>
                    </form>
                </section>
            </footer>
            <section className="mb-18 lg:mb-6 p-11 flex justify-center">
                <p className="opacity-50">
                    © 2024 Buny, All Rights Reserved
                </p>
            </section>
        </>
    )
}

export  { Footer }