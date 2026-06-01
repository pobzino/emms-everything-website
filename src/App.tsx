import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "2347017559517";

const imagePath = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

type Category = "All" | "Bedding" | "Fragrance" | "Body Spray";
type CollectionOption =
  | "editorial"
  | "strip"
  | "magazine"
  | "panels"
  | "windows";

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  image: string;
  badge: string;
  detail: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Botanical Bloom Bedding Set",
    category: "Bedding",
    image: imagePath("images/botanical-bedding.jpeg"),
    badge: "Fresh look",
    detail: "Soft floral bedding with a bright, airy bedroom finish.",
  },
  {
    id: 2,
    name: "Blue Camo Bedding Set",
    category: "Bedding",
    image: imagePath("images/blue-camo-bedding.jpeg"),
    badge: "Bold pick",
    detail: "A cool blue camo set for a confident room refresh.",
  },
  {
    id: 3,
    name: "Gold Leaf Bedding Set",
    category: "Bedding",
    image: imagePath("images/gold-leaf-bedding.jpeg"),
    badge: "Elegant",
    detail: "White bedding with refined branch and gold leaf detailing.",
  },
  {
    id: 4,
    name: "Slate Geometry Bedding Set",
    category: "Bedding",
    image: imagePath("images/slate-geometry-bedding.jpeg"),
    badge: "Modern",
    detail: "Grey bedding with clean graphic accents in white, black, and gold.",
  },
  {
    id: 5,
    name: "Monochrome Classic Bedding Set",
    category: "Bedding",
    image: imagePath("images/monochrome-bedding.jpeg"),
    badge: "Classic",
    detail: "Black and white patterned bedding with a polished hotel feel.",
  },
  {
    id: 6,
    name: "Al Dargam Perfume Collection",
    category: "Fragrance",
    image: imagePath("images/al-dargam-perfumes.jpeg"),
    badge: "Gift ready",
    detail: "Statement perfume options in rich, glossy packaging.",
  },
  {
    id: 7,
    name: "Riggs London Body Sprays",
    category: "Body Spray",
    image: imagePath("images/riggs-body-sprays.jpeg"),
    badge: "Daily scent",
    detail: "Colorful body spray collection for everyday freshness.",
  },
];

const categories: Category[] = ["All", "Bedding", "Fragrance", "Body Spray"];

const marqueeItems = [
  "Fragrances",
  "Body Sprays",
  "Bedding Sets",
  "Home Comfort",
  "Lifestyle Finds",
  "Boutique Quality",
];

const collectionOptions: { id: CollectionOption; label: string }[] = [
  { id: "editorial", label: "Editorial grid" },
  { id: "strip", label: "Product strip" },
  { id: "magazine", label: "Magazine collage" },
  { id: "panels", label: "Tall panels" },
  { id: "windows", label: "Collection windows" },
];

function whatsappLink(item?: string) {
  const text = item
    ? `Hello Emm's Everything, I'm interested in ${item}. Is it available?`
    : "Hello Emm's Everything, I would like to make an enquiry.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeCollection, setActiveCollection] =
    useState<CollectionOption>("editorial");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!reducedMotion.matches) {
      const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.16,
        },
      );

      revealItems.forEach((item) => observer.observe(item));

      return () => observer.disconnect();
    }
  }, [activeCategory, activeCollection, searchTerm]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    const heroPanel = document.querySelector<HTMLElement>("[data-hero-motion]");

    if (!heroPanel) {
      return;
    }

    let frame = 0;

    const updateHeroMotion = () => {
      frame = 0;
      const rect = heroPanel.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(
        Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0),
        1,
      );
      const eased = progress * progress * (3 - 2 * progress);

      heroPanel.style.setProperty("--hero-main-y", `${eased * 8}px`);
      heroPanel.style.setProperty("--hero-card-y", `${eased * -10}px`);
      heroPanel.style.setProperty("--hero-card-y-alt", `${eased * 8}px`);
      heroPanel.style.setProperty("--hero-copy-y", `${eased * -8}px`);
      heroPanel.style.setProperty("--hero-shadow", `${0.28 + eased * 0.16}`);
    };

    const queueHeroMotion = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateHeroMotion);
    };

    updateHeroMotion();
    window.addEventListener("scroll", queueHeroMotion, { passive: true });
    window.addEventListener("resize", queueHeroMotion);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", queueHeroMotion);
      window.removeEventListener("resize", queueHeroMotion);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.detail.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Emm's Everything home">
          <img
            src={imagePath("images/logo-emms-everything.jpeg")}
            alt="Emm's Everything logo"
          />
          <span>
            <strong>Emm's Everything</strong>
            <small>Curated lifestyle finds</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#shop">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <a className="whatsapp-lite" href={whatsappLink()} target="_blank">
            <MessageCircle size={18} />
            WhatsApp
          </a>
          <button
            className="menu-button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="#shop" onClick={() => setMenuOpen(false)}>
            Shop
          </a>
          <a href="#collections" onClick={() => setMenuOpen(false)}>
            Collections
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
      )}

      <main id="top">
        <section className="hero hero-full-bleed">
          <div className="hero-full-panel" data-hero-motion>
            <div
              className="hero-mosaic"
              aria-label="Emm's Everything product mosaic"
            >
              <div className="mosaic-tile mosaic-main">
                <img
                  src={imagePath("images/blue-camo-bedding.jpeg")}
                  alt="Blue camo bedding set"
                />
              </div>
              <div className="mosaic-tile mosaic-perfume">
                <img
                  src={imagePath("images/al-dargam-perfumes.jpeg")}
                  alt="Al Dargam perfume collection"
                />
              </div>
              <div className="mosaic-tile mosaic-spray">
                <img
                  src={imagePath("images/riggs-body-sprays.jpeg")}
                  alt="Riggs London body spray collection"
                />
              </div>
              <div className="mosaic-tile mosaic-gold">
                <img
                  src={imagePath("images/gold-leaf-bedding.jpeg")}
                  alt="Gold leaf bedding set"
                />
              </div>
              <div className="mosaic-tile mosaic-mono">
                <img
                  src={imagePath("images/monochrome-bedding.jpeg")}
                  alt="Monochrome bedding set"
                />
              </div>
            </div>
            <div className="hero-full-copy">
              <span className="eyebrow">
                <span className="eyebrow-line" aria-hidden="true" />
                Emm's Everything
              </span>
              <h1>
                Uniqueness in <em>everything.</em>
              </h1>
              <p>
                Premium-feeling finds for the room, the scent shelf, and the
                everyday gift list.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#shop">
                  Shop arrivals <ArrowRight size={18} />
                </a>
                <a
                  className="secondary-button"
                  href={whatsappLink()}
                  target="_blank"
                >
                  WhatsApp us <MessageCircle size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Store benefits">
          <div className="reveal">
            <span className="trust-icon">
              <Truck size={22} />
            </span>
            <span>
              <strong>Delivery support</strong>
              <small>Shipped to your door</small>
            </span>
          </div>
          <div className="reveal">
            <span className="trust-icon">
              <ShieldCheck size={22} />
            </span>
            <span>
              <strong>Quality checked</strong>
              <small>Every item inspected</small>
            </span>
          </div>
          <div className="reveal">
            <span className="trust-icon">
              <MessageCircle size={22} />
            </span>
            <span>
              <strong>Easy WhatsApp ordering</strong>
              <small>Chat to place your order</small>
            </span>
          </div>
          <div className="reveal">
            <span className="trust-icon">
              <ShoppingBag size={22} />
            </span>
            <span>
              <strong>Curated items</strong>
              <small>Handpicked with care</small>
            </span>
          </div>
        </section>

        <section className="marquee-section reveal" aria-label="Featured categories">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <i aria-hidden="true" />
              </span>
            ))}
          </div>
        </section>

        <section className="section" id="collections">
          <div className="section-heading reveal">
            <span className="eyebrow">
              <Filter size={16} /> Collections
            </span>
            <h2>Shop by mood, room, or scent.</h2>
          </div>

          <div className="collection-grid">
            <a href="#shop" className="collection-tile tall reveal">
              <img
                src={imagePath("images/blue-camo-bedding.jpeg")}
                alt="Blue bedding set"
              />
              <span>Bedroom refresh</span>
            </a>
            <a href="#shop" className="collection-tile reveal">
              <img
                src={imagePath("images/al-dargam-perfumes.jpeg")}
                alt="Perfume collection"
              />
              <span>Signature scents</span>
            </a>
            <a href="#shop" className="collection-tile reveal">
              <img
                src={imagePath("images/riggs-body-sprays.jpeg")}
                alt="Body spray collection"
              />
              <span>Daily freshness</span>
            </a>
          </div>
        </section>

        <section className="section shop-section" id="shop">
          <div className="shop-heading reveal">
            <div>
              <span className="eyebrow">
                <ShoppingBag size={16} /> Product catalog
              </span>
              <h2>Browse the latest items.</h2>
            </div>

            <label className="search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search bedding, perfume, body spray"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </div>

          <div className="category-tabs reveal" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <article
                className="product-card reveal"
                key={product.id}
                style={
                  {
                    "--reveal-delay": `${Math.min(index, 5) * 70}ms`,
                  } as CSSProperties
                }
              >
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-badge">{product.badge}</span>
                </div>
                <div className="product-body">
                  <p className="product-category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p>{product.detail}</p>
                  <div className="product-footer">
                    <span className="product-price">Ask for price</span>
                    <a
                      className="product-action"
                      href={whatsappLink(product.name)}
                      target="_blank"
                    >
                      Order <MessageCircle size={15} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              No items matched your search. Try another category or message us
              directly.
            </div>
          )}
        </section>

        <section className="feature-band reveal">
          <div className="feature-copy">
            <span className="eyebrow">
              <CheckCircle2 size={16} /> Simple ordering
            </span>
            <h2>See something you like? Send the exact item in one tap.</h2>
            <p>
              Every product button opens WhatsApp with the item name already in
              the message, so customers can ask for availability, price, and
              delivery details quickly.
            </p>
            <a className="primary-button" href={whatsappLink()} target="_blank">
              Start a WhatsApp chat <ArrowRight size={18} />
            </a>
          </div>
          <div className="feature-stack">
            <img
              src={imagePath("images/gold-leaf-bedding.jpeg")}
              alt="Gold leaf bedding"
            />
            <img
              src={imagePath("images/slate-geometry-bedding.jpeg")}
              alt="Grey bedding"
            />
          </div>
        </section>

        <section className="section about-section reveal" id="about">
          <div>
            <span className="eyebrow">
              <Sparkles size={16} /> About the brand
            </span>
            <h2>Uniqueness in everything.</h2>
          </div>
          <p>
            Emm's Everything brings together practical, stylish, and gift-worthy
            items for everyday living. The brand experience should feel polished
            and warm: premium enough to trust, simple enough to order from
            instantly.
          </p>
        </section>

        <section className="section contact-section reveal" id="contact">
          <div>
            <span className="eyebrow">
              <Phone size={16} /> Contact
            </span>
            <h2>Ready to take orders on WhatsApp.</h2>
          </div>
          <div className="contact-grid">
            <a href={whatsappLink()} target="_blank">
              <MessageCircle size={22} />
              <span>+234 701 755 9517</span>
            </a>
            <a href="mailto:hello@emmseverything.com">
              <Mail size={22} />
              <span>hello@emmseverything.com</span>
            </a>
            <a href="https://instagram.com" target="_blank">
              <Instagram size={22} />
              <span>Instagram</span>
            </a>
            <span>
              <MapPin size={22} />
              <span>Nigeria</span>
            </span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <img
            src={imagePath("images/logo-emms-everything.jpeg")}
            alt="Emm's Everything logo"
          />
          <span>Emm's Everything</span>
        </div>
        <p>Curated lifestyle finds. WhatsApp-first ordering.</p>
      </footer>

      <a
        className="floating-whatsapp"
        href={whatsappLink()}
        target="_blank"
        aria-label="Chat with Emm's Everything on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}

export default App;
