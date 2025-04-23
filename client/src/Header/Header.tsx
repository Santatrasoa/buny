import logoBuny from "../assets/logo.png";
import { BiMenuAltRight, BiSearch, BiShoppingBag, BiUser } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCloud } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [showOverlay, setShowOverlay] = useState(false); // pour l'overlay
  const navItems = ["Home", "Shop", "Products", "Contact"];

  const handleMenuClick = () => setIsMenuClicked(!isMenuClicked);
  const handleSetActive = (item: string) => {
    setActiveItem(item);
    setIsMenuClicked(false); // Ferme le menu après avoir cliqué sur un élément
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuClicked(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let timeout: number;
    if (isMenuClicked) {
      timeout = window.setTimeout(() => setShowOverlay(true), 900);
    } else {
      setShowOverlay(false);
    }
    return () => clearTimeout(timeout);
  }, [isMenuClicked]);
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuClicked(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  console.log(isMenuClicked)

  return (
    <header className="bg-gray-100 text-sm">
      {/* Mode Desktop */}
      <div className="hidden lg:block">
        <nav className="flex fixed justify-evenly items-center py-6 w-full shadow-sm bg-[#f1f1f1]">
          <ul className="flex justify-evenly text-[#777] items-center [width:33.33%]">
            {navItems.map((item) => (
              <li
                key={item}
                className={`space-pd relative ${activeItem === item ? "text-[#000]" : ""}`}
                onClick={() => handleSetActive(item)}
              >
                <a href="#">
                  {item}
                  {activeItem === item && (
                    <FaCloud className="absolute inset-0 text-gray-300 z-10" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="[width:33.33%] flex items-center justify-center">
            <img src={logoBuny} alt="Buny" className="w-[110px] h-[35px]" />
          </div>

          <ul className="flex justify-evenly items-center [width:33.33%]">
            {[BiSearch, BiUser, BiShoppingBag].map((Icon, index) => (
              <Icon key={index} className="w-6 h-6 cursor-pointer" />
            ))}
          </ul>
        </nav>
      </div>

      {/* Mode Mobile */}
      <div className="lg:hidden">
        <nav className="flex justify-between items-center py-6 shadow-sm bg-[#f1f1f1]">
          <BiMenuAltRight
            className="w-8 h-8 cursor-pointer ml-4 transition-all z-[1000]"
            onClick={handleMenuClick}
          />
          <img src={logoBuny} alt="Buny" className="w-[110px] h-[35px]" />
          <BiShoppingBag className="w-6 h-6 cursor-pointer mr-4" />
        </nav>

        <div className="absolute top-0 left-0 w-full h-screen flex">
          {/* Menu gauche animé */}
          <div
            className={`bg-gray-100 w-1/2 h-full flex flex-col items-center justify-start py-11 
                        transform transition-transform duration-[1000ms] ease-in-out`}
            style={{
              transform: isMenuClicked ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setIsMenuClicked(false)}
            >
              <MdClose className="w-6 h-6 border-solid border-2 rounded-2xl" />
            </button>
            <ul className="space-y-6 text-lg">
              {navItems.map((item) => (
                <li
                  key={item}
                  className={`cursor-pointer ${
                    activeItem === item ? "text-[#000]" : "text-[#777]"
                  }`}
                  onClick={() => handleSetActive(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Overlay à droite */}
          {showOverlay && (
            <div
              className="bg-black opacity-10 w-1/2 h-full transition-opacity duration-300 ease-in-out"
              onClick={() => setIsMenuClicked(false)}
            ></div>
          )}
        </div>


        {/* Mobile Footer Menu */}
        <div className="fixed bottom-0 w-full p-1 shadow [background-color:#f1f1f1] flex justify-around text-xs z-[10000]">
          <div className="flex flex-col items-center m-2 hover:opacity-50 transition">
            <BiShoppingBag className="w-6 h-6" />
            <a href="shop.html">Shop</a>
          </div>
          <div className="flex flex-col items-center m-2 hover:opacity-50 transition">
            <BiUser className="w-6 h-6" />
            <a href="#">Account</a>
          </div>
          <div className="flex flex-col items-center m-2 hover:opacity-50 transition">
            <BiSearch className="w-6 h-6" />
            <span>Search</span>
          </div>
        </div>
      </div>
    </header>
  );
}