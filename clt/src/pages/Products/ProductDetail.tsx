import { useState } from "react";

const SAGE = "#719378";

const SageButton = ({
  children,
  onClick,
  className = "",
  outline = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  outline?: boolean;
}) => (
  <button
    onClick={onClick}
    style={
      outline
        ? { border: `1px solid #e5e4e5`, color: "rgba(0,0,0,0.15)" }
        : { backgroundColor: SAGE, color: "#fff", border: "none" }
    }
    className={`rounded-full font-bold cursor-pointer transition-all duration-200 ${className}`}
    onMouseEnter={(e) => {
      if (outline) {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = SAGE;
        (e.currentTarget as HTMLButtonElement).style.color = "#fff";
      }
    }}
    onMouseLeave={(e) => {
      if (outline) {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.15)";
      }
    }}
  >
    {children}
  </button>
);

const ProductThumb = ({ label }: { label: string }) => (
  <div
    className="w-full rounded-2xl flex items-center justify-center text-white text-sm font-semibold"
    style={{ backgroundColor: "#d4e0d7", height: 140 }}
  >
    {label}
  </div>
);

const QuantitySelector = () => {
  const [qty, setQty] = useState(1);
  return (
    <div
      className="flex items-center rounded-full px-3 py-2"
      style={{ border: "1px solid #e5e4e5", width: "25%" }}
    >
      <button
        className="w-8 h-8 bg-transparent border-none cursor-pointer text-lg"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
      >
        −
      </button>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        className="text-center outline-none border-none w-full text-base"
        style={{ appearance: "textfield" }}
      />
      <button
        className="w-8 h-8 bg-transparent border-none cursor-pointer text-lg"
        onClick={() => setQty((q) => q + 1)}
      >
        +
      </button>
    </div>
  );
};

const CartSidebar = ({
  open,
  onClose,
  onBuyNow,
}: {
  open: boolean;
  onClose: () => void;
  onBuyNow: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex"
    style={{ display: open ? "flex" : "none" }}
  >
    <div className="flex-1 bg-black/30" onClick={onClose} />
    <div className="w-80 bg-white h-full shadow-2xl flex flex-col p-6 gap-6">
      <div className="flex justify-between items-center">
        <p className="text-base font-medium">Shopping Cart (0)</p>
        <span className="cursor-pointer text-xl" onClick={onClose}>
          ✕
        </span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-sm opacity-50">Your cart is currently empty.</p>
        <a
          href="/shop"
          className="w-full text-center rounded-full py-3 text-sm font-bold text-white"
          style={{ backgroundColor: SAGE }}
        >
          Show all products
        </a>
        <SageButton outline className="w-full py-3 text-sm" onClick={onBuyNow}>
          Buy now
        </SageButton>
      </div>
    </div>
  </div>
);

const BuyModal = ({
  open,
  onClose,
  onViewProducts,
}: {
  open: boolean;
  onClose: () => void;
  onViewProducts: () => void;
}) => {
  type FormState = {
    name: string;
    email: string;
    location: string;
    message: string;
  };
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    location: "",
    message: "",
  });
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex flex-col items-center">
      <div className="w-full flex justify-end p-4">
        <button
          className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center cursor-pointer text-lg"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <SageButton
          outline
          className="px-8 py-3 text-sm"
          onClick={onViewProducts}
        >
          View Your Products
        </SageButton>
      </div>
      <form
        className="flex flex-col items-center w-full max-w-lg gap-3 pb-10"
        onSubmit={(e) => e.preventDefault()}
      >
        {[
          { id: "name", placeholder: "Name *" },
          { id: "email", placeholder: "Mail *" },
          { id: "location", placeholder: "Location *" },
        ].map((f) => (
          <input
            key={f.id}
            type="text"
            placeholder={f.placeholder}
            className="w-[90%] px-6 py-4 rounded-full outline-none text-base transition-all"
            style={{ border: "1px solid #e5e4e5" }}
            onFocus={(e) => (e.target.style.border = "1px solid #696969")}
            onBlur={(e) => (e.target.style.border = "1px solid #e5e4e5")}
            value={form[f.id as keyof FormState]}
            onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
          />
        ))}
        <textarea
          placeholder="Little message"
          rows={6}
          className="w-[90%] px-6 py-5 rounded-3xl outline-none text-base resize-none transition-all"
          style={{ border: "1px solid #e5e4e5" }}
          onFocus={(e) => (e.target.style.border = "1px solid #696969")}
          onBlur={(e) => (e.target.style.border = "1px solid #e5e4e5")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button
          type="submit"
          className="rounded-full px-12 py-3 text-white text-base font-bold"
          style={{ backgroundColor: SAGE }}
        >
          Buy now
        </button>
      </form>
    </div>
  );
};

const ViewProductsOverlay = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="flex justify-end items-center h-24 px-8">
        <button
          className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center cursor-pointer text-lg"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-8">
        {["Product 1", "Product 2", "Product 3"].map((p) => (
          <div key={p} className="w-48 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-2xl"
              style={{ backgroundColor: "#d4e0d7", height: 180 }}
            />
            <p className="text-sm font-semibold">{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RelatedCard = ({ name, price }: { name: string; price: string }) => (
  <div className="flex flex-col items-center cursor-pointer w-[25%] max-md:w-[48%] max-sm:w-full gap-2">
    <div
      className="w-full rounded-3xl transition-transform duration-300 hover:scale-95"
      style={{ backgroundColor: "#d4e0d7", height: 260 }}
    />
    <div className="flex flex-col items-start w-full px-2">
      <p className="text-sm font-bold">{name}</p>
      <span style={{ color: SAGE }} className="text-lg font-medium">
        {price}
      </span>
    </div>
  </div>
);

export default function ProductDetail() {
  const [cartOpen, setCartOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "review">(
    "description",
  );
  const [frontVisible, setFrontVisible] = useState(true);
  const [viewers] = useState(24);

  return (
    <div
      className="font-sans min-h-screen flex flex-col"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onBuyNow={() => {
          setCartOpen(false);
          setBuyOpen(true);
        }}
      />
      <BuyModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        onViewProducts={() => {
          setBuyOpen(false);
          setViewOpen(true);
        }}
      />
      <ViewProductsOverlay open={viewOpen} onClose={() => setViewOpen(false)} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="flex items-center px-5 py-4">
          <p className="text-sm font-light opacity-60">
            Home &gt; Shop &gt; Baby
          </p>
        </section>

        {/* Product info */}
        <section className="flex flex-col md:flex-row w-full">
          {/* Images */}
          <div className="flex md:w-[60%] w-full p-3 gap-3">
            <div className="flex flex-col gap-5 w-[38%]">
              <div
                className="rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-90"
                onClick={() => setFrontVisible(true)}
              >
                <ProductThumb label="Front View" />
              </div>
              <div
                className="rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-90"
                onClick={() => setFrontVisible(false)}
              >
                <ProductThumb label="Back View" />
              </div>
            </div>

            <div
              className="rounded-3xl flex items-center justify-center text-white text-sm font-semibold"
              style={{
                width: "58%",
                backgroundColor: "#c8d9cc",
                minHeight: 320,
              }}
            >
              {frontVisible ? "Main — Front" : "Main — Back"}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col md:w-[40%] w-full p-4">
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-xl font-light pl-2 pb-1 mb-2 border-b border-gray-100">
                Baby Onesie — Sage Collection
              </h1>
              <span className="text-lg pl-2 mt-2 mb-5" style={{ color: SAGE }}>
                $24.99
              </span>
              <p className="text-sm pl-2 opacity-70 leading-relaxed">
                Soft, breathable organic cotton onesie perfect for your little
                one. Available in multiple sizes and colours.
              </p>
            </div>

            <div className="flex items-center mt-24 px-2 gap-2">
              <QuantitySelector />
              <SageButton className="py-4 text-sm flex-1">
                Add to Cart
              </SageButton>
            </div>

            <div className="flex justify-center mt-4 w-full">
              <SageButton
                outline
                className="w-[90%] py-5 text-sm"
                onClick={() => setBuyOpen(true)}
              >
                Buy Now
              </SageButton>
            </div>

            <div className="flex items-center gap-2 mt-12 pl-2">
              <span
                className="text-sm"
                style={{ animation: "blink 1s infinite" }}
              >
                👁
              </span>
              <p className="text-xs opacity-50">
                {viewers} people are viewing this
              </p>
            </div>
          </div>
        </section>

        {/* Description tabs */}
        <section
          className="flex justify-evenly w-full px-5 py-4"
          style={{ border: "1px solid #e5e4e5" }}
        >
          {(["description", "review"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="rounded-full py-4 text-sm font-bold w-[30%] capitalize transition-all duration-200"
              style={
                activeTab === tab
                  ? { backgroundColor: SAGE, color: "#fff", border: "none" }
                  : {
                      backgroundColor: "transparent",
                      border: `1px solid #e5e4e5`,
                      color: "#000",
                    }
              }
            >
              {tab === "description" ? "Description" : "Review"}
            </button>
          ))}
        </section>

        {/* Tab content */}
        <section className="w-full">
          {activeTab === "description" ? (
            <p className="text-sm opacity-50 p-5 leading-relaxed text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              veniam officia natus. Tenetur fugit incidunt maiores similique
              odio, corporis esse rerum consequatur possimus dolore excepturi
              voluptatum autem dolorem pariatur delectus. Lorem ipsum dolor, sit
              amet consectetur adipisicing elit. Dicta repellendus voluptatem
              commodi nemo corrupti illum illo fugit optio eaque est earum,
              perferendis quaerat minus tempore debitis veritatis saepe
              distinctio dolor.
            </p>
          ) : (
            <p className="text-sm opacity-50 p-5">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </section>

        {/* Related products */}
        <section className="pb-16">
          <div className="flex items-center justify-center py-5">
            <h1 className="text-2xl font-light">Related Products</h1>
          </div>
          <div className="flex flex-wrap justify-evenly gap-4 px-4">
            {[
              { name: "Baby Romper", price: "$19.99" },
              { name: "Knit Sweater", price: "$29.99" },
              { name: "Soft Pants", price: "$15.99" },
              { name: "Floral Dress", price: "$22.99" },
            ].map((p) => (
              <RelatedCard key={p.name} {...p} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{ backgroundColor: "#f8f8f8" }}
        className="border-t border-gray-200"
      >
        <div className="flex flex-wrap items-start justify-evenly gap-8 px-8 py-10">
          <div
            className="flex items-center justify-center w-24 h-24 rounded-full text-white text-3xl font-bold"
            style={{ backgroundColor: SAGE }}
          >
            B
          </div>
          <div className="flex flex-col gap-1 text-sm opacity-60">
            <p>Gyan Singh Market,</p>
            <p>Sector 22</p>
            <p>Noida, UP 201301</p>
            <br />
            <p>Call us now: +91-9871833367</p>
            <p>Email: demoeuma@gmail.com</p>
          </div>
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Email ..."
              className="px-5 py-3 outline-none text-sm bg-white w-48"
            />
            <button
              className="px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: SAGE }}
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 text-xs opacity-50">
          <p>© 2024 Buny, All Rights Reserved</p>
          <p>💳 Secure Payment</p>
        </div>
      </footer>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
