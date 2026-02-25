import { useEffect, useState } from "react";
import API from "../services/api";
import MenuCard from "../components/MenuCard";

const CATEGORIES = ["All", "Pizza", "Burger", "Drinks"];

function SkeletonCard() {
    return (
        <div className="glass" style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div className="skeleton" style={{ height: "180px" }} />
            <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="skeleton" style={{ height: "20px", width: "70%", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "14px", width: "90%", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "14px", width: "60%", borderRadius: "6px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                    <div className="skeleton" style={{ height: "28px", width: "60px", borderRadius: "6px" }} />
                    <div className="skeleton" style={{ height: "40px", width: "90px", borderRadius: "10px" }} />
                </div>
            </div>
        </div>
    );
}

export default function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    useEffect(() => {
        setLoading(true);
        const params = activeCategory !== "All" ? { category: activeCategory } : {};
        API.get("/menu", { params })
            .then(res => setMenu(res.data))
            .finally(() => setLoading(false));
    }, [activeCategory]);

    const filtered = menu.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-content">
            
            <div style={{
                background: "linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(10,10,15,0) 60%)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "48px 32px 40px",
            }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <p style={{
                        fontSize: "13px", fontWeight: 600, textTransform: "uppercase",
                        letterSpacing: "2px", color: "var(--accent)", marginBottom: "12px"
                    }}>
                        🔥 Order Now, Eat Happy
                    </p>
                    <h1 style={{
                        fontSize: "clamp(28px, 5vw, 52px)",
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #f0f0f0 0%, #9a9aaa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        lineHeight: 1.1,
                        marginBottom: "20px",
                        letterSpacing: "-1px"
                    }}>
                        Fresh, Fast &<br />
                        <span style={{
                            background: "linear-gradient(135deg, #ff6b35, #ff8c5a)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}>Delivered Hot</span>
                    </h1>

               
                    <div style={{ position: "relative", maxWidth: "400px" }}>
                        <span style={{
                            position: "absolute", left: "16px", top: "50%",
                            transform: "translateY(-50%)", fontSize: "16px",
                            pointerEvents: "none"
                        }}>🔍</span>
                        <input
                            id="menu-search"
                            type="text"
                            placeholder="Search items..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field"
                            style={{ paddingLeft: "44px" }}
                        />
                    </div>
                </div>
            </div>

          
            <div style={{
                padding: "24px 32px 0",
                maxWidth: "1100px",
                margin: "0 auto",
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                paddingBottom: "4px"
            }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        id={`category-tab-${cat.toLowerCase()}`}
                        className={`category-tab ${activeCategory === cat ? "active" : ""}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat === "All" ? "🍽 All" : cat === "Pizza" ? "🍕 Pizza" : cat === "Burger" ? "🍔 Burger" : "🥤 Drinks"}
                    </button>
                ))}
            </div>

        
            <div style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "28px 32px 60px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: "24px"
            }}>
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    : filtered.length === 0
                        ? (
                            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍽</div>
                                <p style={{ fontSize: "18px", fontWeight: 500 }}>No items found</p>
                            </div>
                        )
                        : filtered.map((item, i) => (
                            <div key={item._id} style={{ animationDelay: `${i * 0.05}s` }}>
                                <MenuCard item={item} />
                            </div>
                        ))
                }
            </div>
        </div>
    );
}