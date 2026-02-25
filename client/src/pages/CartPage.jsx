import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import CheckoutForm from "../components/CheckoutForm";

export default function CartPage() {
    const { cart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="page-content" style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                minHeight: "calc(100vh - 68px)",
                textAlign: "center", padding: "40px"
            }}>
                <div style={{ fontSize: "72px", marginBottom: "20px" }}>🛒</div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "10px", color: "var(--text-primary)" }}>
                    Your cart is empty
                </h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
                    Add some delicious items from the menu!
                </p>
                <Link to="/" className="btn-primary" style={{ textDecoration: "none", padding: "14px 28px" }}>
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="page-content" style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>Your Cart</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in your order
                    </p>
                </div>
                <Link to="/" className="btn-ghost" style={{ textDecoration: "none", padding: "10px 18px", fontSize: "14px" }}>
                    ← Continue Shopping
                </Link>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr min(380px, 100%)",
                gap: "28px",
                alignItems: "start"
            }}>
                {/* Cart Items */}
                <div>
                    {cart.map(item => (
                        <CartItem key={item._id} item={item} />
                    ))}
                </div>

                {/* Order Summary + Checkout */}
                <div
                    className="glass"
                    style={{
                        borderRadius: "var(--radius-xl)",
                        padding: "28px",
                        position: "sticky",
                        top: "88px"
                    }}
                >
                    <h3 style={{
                        fontSize: "16px", fontWeight: 700,
                        color: "var(--text-primary)", marginBottom: "20px",
                        display: "flex", alignItems: "center", gap: "8px"
                    }}>
                        🧾 Order Summary
                    </h3>

                    {/* Line items */}
                    {cart.map(item => (
                        <div key={item._id} style={{
                            display: "flex", justifyContent: "space-between",
                            marginBottom: "10px", fontSize: "14px"
                        }}>
                            <span style={{ color: "var(--text-secondary)" }}>
                                {item.name} × {item.quantity}
                            </span>
                            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                                ₹{item.price * item.quantity}
                            </span>
                        </div>
                    ))}

                    <hr style={{ margin: "16px 0" }} />

                    {/* Delivery fee */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>Delivery fee</span>
                        <span style={{ color: "var(--success)", fontWeight: 500 }}>FREE</span>
                    </div>

                    {/* Total */}
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        padding: "14px 0 0",
                        borderTop: "1px solid var(--border)"
                    }}>
                        <span style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
                        <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--accent)" }}>₹{total}</span>
                    </div>

                    <CheckoutForm />
                </div>
            </div>
        </div>
    );
}