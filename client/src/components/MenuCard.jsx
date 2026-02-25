import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function MenuCard({ item }) {
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const [adding, setAdding] = useState(false);

    const handleAdd = () => {
        setAdding(true);
        addToCart(item);
        addToast(`${item.name} added to cart!`, "success");
        setTimeout(() => setAdding(false), 600);
    };

    return (
        <div
            data-testid="menu-card"
            className="glass fade-up"
            style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                transition: "var(--transition)",
                cursor: "default",
                position: "relative",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,53,0.2)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
            }}
        >
            
            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                <img
                    src={item.image}
                    alt={item.name}
                    style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                {/* Category badge */}
                {item.category?.name && (
                    <span style={{
                        position: "absolute", top: "12px", left: "12px",
                        background: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(8px)",
                        color: "#ff6b35",
                        fontSize: "11px", fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "50px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        border: "1px solid rgba(255,107,53,0.3)"
                    }}>
                        {item.category.name}
                    </span>
                )}
              
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
                    background: "linear-gradient(transparent, rgba(10,10,15,0.6))"
                }} />
            </div>

       
            <div style={{ padding: "16px 20px 20px" }}>
                <h3 style={{
                    fontSize: "17px", fontWeight: 700,
                    color: "var(--text-primary)", marginBottom: "6px",
                    lineHeight: 1.3
                }}>
                    {item.name}
                </h3>
                <p style={{
                    fontSize: "13px", color: "var(--text-secondary)",
                    lineHeight: 1.5, marginBottom: "16px",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                    {item.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                        fontSize: "22px", fontWeight: 800,
                        color: "var(--accent)",
                    }}>
                        ₹{item.price}
                    </span>

                    <button
                        id={`add-to-cart-${item._id}`}
                        className="btn-primary"
                        onClick={handleAdd}
                        style={{
                            padding: "10px 18px",
                            fontSize: "14px",
                            transform: adding ? "scale(0.95)" : "scale(1)",
                        }}
                    >
                        {adding ? "✓ Added" : "+ Add"}
                    </button>
                </div>
            </div>
        </div>
    );
}