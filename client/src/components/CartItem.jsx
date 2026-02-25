import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();

    const subtotal = item.price * item.quantity;

    return (
        <div
            data-testid="cart-item"
            className="glass"
            style={{
                borderRadius: "var(--radius-md)",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "12px",
            }}
        >
            
            <img
                src={item.image}
                alt={item.name}
                style={{
                    width: "72px", height: "72px",
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    flexShrink: 0,
                }}
            />

            
            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                    fontSize: "15px", fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "2px",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                    {item.name}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>₹{item.price} each</p>
            </div>

            
            <div className="stepper">
                <button
                    id={`decrease-${item._id}`}
                    className="stepper-btn"
                    onClick={() => {
                        if (item.quantity === 1) removeFromCart(item._id);
                        else updateQuantity(item._id, item.quantity - 1);
                    }}
                    aria-label="Decrease quantity"
                >
                    −
                </button>
                <span className="stepper-value">{item.quantity}</span>
                <button
                    id={`increase-${item._id}`}
                    className="stepper-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>

            
            <span style={{
                fontSize: "17px", fontWeight: 700,
                color: "var(--accent)",
                minWidth: "64px", textAlign: "right",
                flexShrink: 0,
            }}>
                ₹{subtotal}
            </span>

         
            <button
                id={`remove-${item._id}`}
                onClick={() => removeFromCart(item._id)}
                aria-label="Remove item"
                style={{
                    background: "none", border: "none",
                    color: "var(--text-muted)",
                    fontSize: "18px", cursor: "pointer",
                    padding: "4px",
                    borderRadius: "6px",
                    transition: "var(--transition)",
                    lineHeight: 1,
                    flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--error)"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}
            >
                ×
            </button>
        </div>
    );
}