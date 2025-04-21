import logoBuny from "../assets/logo.png"
import { BiMenuAltRight, BiSearch, BiShoppingBag, BiUser } from "react-icons/bi";

export default function Header() {
    return (
      <>
        {/* Desktop Header */}
        <header className="bg-gray-100 text-sm">
        <header className="hidden lg:block">
            <nav className="flex fixed justify-evenly items-center py-6 w-full [background-color:#f1f1f1]">
                <ul className="flex justify-evenly items-center [width:33.33%]">
                    <li className="space-pd">Home</li>
                    <li className="space-pd">Shop</li>
                    <li className="space-pd">Products</li>
                    <li className="space-pd">Contact</li>
                </ul>
            
                <div className="[width:33.33%] flex items-center justify-center">
                    <img
                        src={logoBuny}
                        alt="Buny"
                        className="w-[110px] h-[35px]" />
                </div>

                <ul className="flex justify-evenly items-center [width:33.33%]">
                    <BiSearch className="w-6 h-6 cursor-pointer" />
                    <BiUser className="w-6 h-6 cursor-pointer" />
                    <BiShoppingBag className="w-6 h-6 cursor-pointer" />
                </ul>
            </nav>
            </header>
            
          {/* Mobile Header */}
          <nav className="lg:hidden flex justify-between items-center shadow p-5">
            <BiMenuAltRight className="h-11 w-11"/>
            <img src={logoBuny} className="w-[110px] h-[35px]" />
            <BiShoppingBag className="h-8 w-8"/>  
          </nav>
  
          {/* Mobile Footer Menu */}
          <div className="lg:hidden fixed bottom-0 w-full p-1 shadow [background-color:#f1f1f1] flex justify-around text-xs z-[10000]">
            <div className="flex flex-col items-center m-2 hover:opacity-50 transition">
                <BiShoppingBag className="w-6 h-6"/>
                <a href="shop.html">Shop</a>
            </div>
            <div className="flex flex-col items-center m-2 hover:opacity-50 transition">
                <BiUser className="w-6 h-6"/>
                <a href="#">Account</a>
            </div>
            <div className="flex flex-col items-center m-2 hover:opacity-50 transition">
                <BiSearch className="w-6 h-6"/>
                <span>Search</span>
            </div>
          </div>
        </header>
      </>
    );
  }
  