import logoBuny from "../assets/logo.png";
import { BiMenuAltRight, BiSearch, BiShoppingBag, BiUser } from "react-icons/bi";
import { FaCloud } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const handleMenuClick = () => setIsMenuClicked(!isMenuClicked);
  const handleSetActive = (item: string) => setActiveItem(item);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuClicked(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = ["Home", "Shop", "Products", "Contact"];

  return (
    <header className="bg-gray-100 text-sm">
      <header className="hidden lg:block">
        <nav className="flex fixed justify-evenly items-center py-6 w-full [background-color:#f1f1f1]">
          <ul className="flex justify-evenly text-[#777] items-center [width:33.33%]">
            {navItems.map((item) => (
              <li
                key={item}
                className={`space-pd relative ${activeItem === item ? "text-[#000]" : ""}`}
                onClick={() => handleSetActive(item)}
              >
                {item}
                {activeItem === item && (
                  <FaCloud className="absolute inset-0 -z-10" />
                )}
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
      </header>
    </header>
  );
}