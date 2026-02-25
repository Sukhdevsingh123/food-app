import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OrderStatus from "../components/OrderStatus";
import API from "../services/api";

export default function OrderTrackingPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/orders/${id}`)
            .then(res => setOrder(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="page-content" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "calc(100vh - 68px)"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div className="spinner" style={{ margin: "0 auto 16px", width: 40, height: 40, borderWidth: 3 }} />
                    <p style={{ color: "var(--text-secondary)" }}>Loading your order...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content" style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px 60px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
                <div>
                    <h1 style={{
                        fontSize: "26px", fontWeight: 800,
                        color: "var(--text-primary)", marginBottom: "4px"
                    }}>
                        Track Order
                    </h1>
                    <p style={{
                        fontSize: "13px", color: "var(--text-muted)",
                        fontFamily: "monospace"
                    }}>
                        #{id}
                    </p>
                </div>
                <Link to="/" className="btn-ghost" style={{ textDecoration: "none" }}>
                    ← Back to Menu
                </Link>
            </div>

            
            <OrderStatus orderId={id} orderDetails={order} />


            {order && (
                <div className="glass" style={{
                    borderRadius: "var(--radius-xl)",
                    padding: "28px",
                    marginTop: "24px"
                }}>
                    <h3 style={{
                        fontSize: "16px", fontWeight: 700, color: "var(--text-primary)",
                        marginBottom: "20px",
                        display: "flex", alignItems: "center", gap: "8px"
                    }}>
                        🍽 Items Ordered
                    </h3>

                    {order.items?.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 0",
                                borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                {item.menuItem?.image && (
                                    <img
                                        src={item.menuItem.image}
                                        alt={item.menuItem?.name}
                                        style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
                                    />
                                )}
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                                        {item.menuItem?.name || "Unknown Item"}
                                    </p>
                                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                                ₹{(item.menuItem?.price || 0) * item.quantity}
                            </span>
                        </div>
                    ))}

                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        paddingTop: "16px", marginTop: "8px",
                        borderTop: "1px solid var(--border)"
                    }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Total Paid</span>
                        <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent)" }}>
                            ₹{order.totalAmount}
                        </span>
                    </div>

                    
                    <div style={{
                        marginTop: "20px",
                        padding: "16px",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)"
                    }}>
                        <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", marginBottom: "10px", fontWeight: 600 }}>
                            Delivery To
                        </p>
                        <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "14px" }}>
                            👤 {order.customer?.name}
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
                            📍 {order.customer?.address}
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
                            📞 {order.customer?.phone}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}