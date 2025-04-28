import bg from "../assets/bg-breadcrumb.jpg"
export default function Contact (){
    const styles = "border-[1px] p-4 outline-none rounded-4xl border-gray-300 focus:border-black transition duration-500"

    return (
        <div className="">
            <div className="flex pt-18 md:pt-16 lg:p-0 w-full items-center">
                <div className="w-full h-1/2 absolute flex justify-center items-center flex-col">
                    <h1 className="text-4xl py-3">Contact</h1>
                    <p className=""><a href="#" className="underline hover:text-purple-500 transition duration-75">Home</a>{" > Contact"}</p>
                </div>
                <img className="w-full" src={bg} alt="" />
            </div>

            <main className="flex flex-col lg:flex-row mb-12 ">    
                <form  className="px-11 flex flex-col z-50" action="" method="post">
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex flex-col p-3">
                            <label className="py-2">Name</label>
                            <input type="text" placeholder="Name*" className={styles} required/>
                        </div>
                        <div className="flex flex-col p-3">
                            <label className="p-2">Email</label>
                            <input type="mail" placeholder="Email address*" className={styles} required/>
                        </div>
                        <div className="flex flex-col p-3">
                            <label className="p-2">Phone</label>
                            <input type="number" placeholder="Phone number*" className={styles} required/>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="area" className="p-2">Message</label>
                        <textarea
                            className={styles + " resize-none mb-5"}
                            id="area"
                            cols={30}
                            rows={10}
                            placeholder="Message or Comment*"
                        ></textarea>
                    </div>
                    <button className="bg-[#719378] w-[200px] px-6 py-3 text-white cursor-pointer rounded-4xl">Send Message</button>
                </form>
                <section className="container-info w-full">
                    <div>
                        <h1>Address</h1>
                        <p>IVK 230 Ankadifotsy Befelatanana</p>
                    </div><hr />
                    <div>
                        <h1>Phone</h1>
                        <p>+261 34 68 216 98</p>
                    </div><hr />
                    <div>
                        <h1>Email</h1>
                        <p>santatraherimampionona@gmail.com</p>
                    </div><hr />
                    <div>
                        <h1>Opening Time</h1>
                        <p>8:00Am – 10:00Pm, Sunday Close</p>
                    </div><hr />
                    <div>
                        <h1>Follow Us On</h1>
                    </div><hr />
                </section>
            </main>
        </div>
    )
}