import bg from "../assets/bg-breadcrumb.jpg"
export default function Contact (){
    return (
        <div>
            <div className="flex w-full lg:pt-20">
                <div className="w-full h-1/2 absolute flex justify-center items-center flex-col">
                    <h1 className="text-4xl py-3">Contact</h1>
                    <p className=""><a href="#" className="underline hover:text-purple-500 transition duration-75">Home</a>{" > Contact"}</p>
                </div>
                <img className="w-full" src={bg} alt="" />
            </div>
            <form  className="" action="" method="post">
                <input type="text" />
            </form>
        </div>
    )
}