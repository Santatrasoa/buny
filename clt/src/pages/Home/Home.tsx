import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

const CATEGORIES = ["All", "Baby", "Boys", "Toys"];

export default function Home() {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [catOpen, setCatOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    productApi
      .list({ active: true, limit: 6 })
      .then((r) => setRecommended(r.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params: Record<string, unknown> = { active: true, limit: 8 };
    if (category !== "All") params.category = category;
    productApi
      .list(params)
      .then((r) => setFiltered(r.data ?? []))
      .catch(() => {});
  }, [category]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <main className="w-full overflow-x-hidden font-mono">
      {/* ── Hero Slider ──────────────────────────────────────────── */}
      {/* container-slide: flex, bg-[#f1f1f1], relative */}
      <section className="flex w-full bg-[#f1f1f1] relative flex-col items-center md:flex-row">
        {/* content-word: w-50%, flex col, centered */}
        <div className="z-10 w-full md:w-1/2 flex flex-col justify-center items-center py-16 px-6">
          <h1 className="text-3xl py-[3px]">Newborn</h1>
          <h1 className="text-3xl py-[3px]">Baby</h1>
          <h1 className="text-3xl py-[3px]">Clothes</h1>
          <p className="opacity-50 text-[15px] py-[5px]">
            Our cutest looks &amp; matching sets,
          </p>
          <p className="opacity-50 text-[15px] py-[5px]">
            designed for easy dressing &amp; every day comfort
          </p>
          <p className="opacity-50 text-[15px] py-[5px]">
            Purschases relating to perenthood and your baby
          </p>
          <Link to="/shop">
            <button className="z-10 bg-[#719378] text-white text-[12px] font-bold leading-[33px] px-[52px] rounded-[25px] m-[10px] cursor-pointer border-0">
              Shop now
            </button>
          </Link>
        </div>

        {/* content-img: w-50%, hidden on mobile */}
        <div className="hidden md:flex w-1/2 justify-center">
          <img
            src="/img/slider-2.jpg"
            alt="baby clothes"
            className="w-[60%] rounded-[3000px_3000px_0_0]"
          />
        </div>

        {/* cloud: absolute bottom */}
        <div className="w-full absolute bottom-[-5px] pointer-events-none">
          <img src="/img/cloud.png" alt="" className="w-full" />
        </div>
      </section>

      {/* ── Recommended ─────────────────────────────────────────── */}
      {/* recommanded: m-[30px], text-center */}
      <section className="m-[30px] text-center">
        <h1 className="text-2xl">Recommanded For You</h1>
        <p className="opacity-40 py-[10px]">
          Fashion Meets Function, On-trend Style
        </p>
      </section>

      {/* container-recommaneded: flex, space-evenly */}
      <section className="w-full flex items-center justify-evenly flex-wrap">
        {recommended.length === 0
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center w-[22%] min-w-[140px] p-4"
              >
                <div className="text-5xl mb-2">👶</div>
                <p className="text-[15px] font-bold text-[#719378] py-[10px]">
                  $24.99
                </p>
                <h3 className="text-[20px] font-light py-[10px]">
                  Baby Outfit {i}
                </h3>
                <p className="text-[13px] opacity-50">Baby</p>
              </div>
            ))
          : recommended.map((p) => <ProductCard key={p.id} product={p} />)}
      </section>

      {/* ── Baby Outfits Banner ──────────────────────────────────── */}
      {/* babyOutfits: flex, p-[15px] */}
      <section className="flex p-[15px] flex-col-reverse md:flex-row">
        <div className="w-full md:w-1/3 flex justify-center items-center p-[10px]">
          <img
            src="/img/banner-2.jpg"
            alt=""
            className="w-[321px] h-[421px] object-cover"
          />
        </div>
        <div className="w-full md:w-1/3 flex justify-center items-center p-[10px]">
          <img
            src="/img/banner-1.jpg"
            alt=""
            className="w-[321px] h-[421px] object-cover"
          />
        </div>
        {/* c-word */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center md:items-start p-[10px] mb-[50px] md:mb-0">
          <h1 className="text-[50px] font-normal">Baby Outfits &amp; Sets</h1>
          <p className="text-[20px] leading-[2] opacity-50 mt-[25px] mb-[25px]">
            Dress your little one in our adorable Baby Outfits &amp; Sets,
            crafted with soft fabrics for maximum comfort and style. From
            snuggly onesies to charming two-piece sets, each ensemble is
            designed to keep your baby cozy and looking oh-so-adorable.
          </p>
          <button
            className="bg-[#719378] text-white text-[12px] font-bold leading-[33px] px-[52px] rounded-[25px] m-[10px] cursor-pointer border-0"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* ── Kids Section ─────────────────────────────────────────── */}
      {/* kids: flex, w-full, justify-center */}
      <section className="flex w-full justify-center flex-col md:flex-row items-center">
        {/* kids-w-content: w-40%, flex-col, p-[30px] */}
        <div className="w-full md:w-[40%] flex flex-col items-center text-start md:text-start p-[30px]">
          <div className="p-[10px] w-full">
            <h1 className="text-[50px] text-start">Kids</h1>
            <h3 className="text-[30px]">Clothing, Shoes &amp; Accessories</h3>
            <p className="text-[20px] leading-[1.8] opacity-50">
              Elevate your child's wardrobe with our versatile range of Kids
              Clothing, Shoes &amp; Accessories, crafted to reflect the latest
              fashion trends while prioritizing comfort and durability.
            </p>
          </div>
          <div className="p-[10px] w-full">
            <img style={{ width: "100%" }} src="/img/banner-video.jpg" alt="" />
          </div>
        </div>

        {/* c-img: w-60% */}
        <div className="w-full md:w-[60%]">
          <img src="/img/lookbook-1.jpg" alt="lookbook" className="w-full" />
        </div>
      </section>

      {/* ── Filter + Product Grid ────────────────────────────────── */}
      {/* cnt-filter: w-full */}
      <div className="w-full">
        {/* select-container: flex, centered, mt-[100px] mb-[100px] */}
        <div
          className="w-full mt-[100px] mb-[100px] flex justify-center items-center"
          ref={selectRef}
        >
          <p className="m-[10px] mr-[30px] text-[20px]">Sort by</p>
          <div className="w-[15%] relative min-w-[120px]">
            {/* select-selected */}
            <div
              className={`text-[15px] bg-white py-[15px] px-[15px] border border-[#e5e4e5] rounded-[25px] cursor-pointer transition-colors duration-200 hover:bg-[#719378] hover:text-white ${
                catOpen ? "bg-[#719378] text-white" : "bg-white"
              }`}
              onClick={() => setCatOpen((o) => !o)}
            >
              {category}
            </div>
            {/* select-items */}
            {catOpen && (
              <div className="bg-white absolute border border-[#e5e4e5] z-[99] w-full box-border p-[5px] text-[15px]">
                {CATEGORIES.map((c) => (
                  <div
                    key={c}
                    className="p-[10px] cursor-pointer hover:bg-[#f1f1f1]"
                    onClick={() => {
                      setCategory(c);
                      setCatOpen(false);
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ct-filter c-1 / c-2 : two columns */}
        <div className="flex justify-center items-center">
          <div className="w-full p-[15px] text-center">
            {filtered
              .filter((_, i) => i % 2 === 0)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
          <div className="w-full p-[15px] text-center">
            {filtered
              .filter((_, i) => i % 2 === 1)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      </div>

      {/* ── View All ─────────────────────────────────────────────── */}
      {/* center-btn: flex, justify-center */}
      <div className="w-full flex justify-center py-8">
        <button
          className="bg-[#719378] text-white text-[12px] font-bold leading-[33px] px-[52px] rounded-[25px] m-[10px] cursor-pointer border-0"
          onClick={() => navigate("/shop")}
        >
          View All
        </button>
      </div>
    </main>
  );
}
