import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const { cartCount } = useCart();
    const location = useLocation();

    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "rgba(10, 10, 15, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
            
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                <div style={{
                    width: "36px", height: "36px",
                    background: "linear-gradient(135deg, #ff6b35, #e84d00)",
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px",
                    boxShadow: "0 4px 12px rgba(255,107,53,0.4)"
                }}>🍕</div>
                <span style={{
                    fontWeight: 800, fontSize: "20px", color: "#f0f0f0",
                    letterSpacing: "-0.5px"
                }}>
                    Bite<span style={{ color: "#ff6b35" }}>Rush</span>
                </span>
            </Link>

            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link
                    to="/"
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: location.pathname === "/" ? "#ff6b35" : "#9a9aaa",
                        background: location.pathname === "/" ? "rgba(255,107,53,0.1)" : "transparent",
                        textDecoration: "none",
                        transition: "all 0.2s",
                    }}
                >
                    Menu
                </Link>

            
                <Link
                    to="/cart"
                    style={{ position: "relative", textDecoration: "none" }}
                    aria-label="Cart"
                >
                    <div style={{
                        width: "42px", height: "42px",
                        borderRadius: "12px",
                        background: location.pathname === "/cart" ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${location.pathname === "/cart" ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.08)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}>
                        🛒
                    </div>
                    {cartCount > 0 && (
                        <span className="badge">{cartCount > 9 ? "9+" : cartCount}</span>
                    )}
                </Link>
            </div>
        </nav>
    );
}
