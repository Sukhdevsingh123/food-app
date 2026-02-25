import { useEffect, useState, useRef } from "react";
import socket from "../services/socket";
import API from "../services/api";

const STEPS = [
    { key: "Order Received", icon: "📋", label: "Order Received" },
    { key: "Preparing", icon: "👨‍🍳", label: "Preparing" },
    { key: "Out for Delivery", icon: "🛵", label: "Out for Delivery" },
    { key: "Delivered", icon: "✅", label: "Delivered" },
];

const STATUS_MESSAGES = {
    "Order Received": "Your order has been received and confirmed!",
    "Preparing": "Our chefs are preparing your delicious food...",
    "Out for Delivery": "Your order is on the way! 🏃",
    "Delivered": "Order delivered! Enjoy your meal! 🎉",
};

export default function OrderStatus({ orderId, orderDetails }) {
    const [status, setStatus] = useState(orderDetails?.status || "Order Received");
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        
        API.get(`/orders/${orderId}`)
            .then(res => {
                if (isMounted.current) setStatus(res.data.status);
            })
            .catch(() => { });

        const handler = (data) => {
            if (String(data.orderId) === String(orderId) && isMounted.current) {
                setStatus(data.status);
            }
        };

        socket.on("orderStatusUpdate", handler);
        return () => {
            isMounted.current = false;
            socket.off("orderStatusUpdate", handler);
        };
    }, [orderId]);

    const currentIdx = STEPS.findIndex(s => s.key === status);

    return (
        <div data-testid="order-status">
          
            <div
                className="glass"
                style={{
                    borderRadius: "var(--radius-xl)",
                    padding: "32px",
                    textAlign: "center",
                    marginBottom: "32px",
                    background: "rgba(255,107,53,0.05)",
                    borderColor: "rgba(255,107,53,0.2)",
                }}
            >
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                    {STEPS[currentIdx]?.icon}
                </div>
                <h2 style={{
                    fontSize: "22px", fontWeight: 800, color: "var(--text-primary)",
                    marginBottom: "8px"
                }}>
                    {status}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
                    {STATUS_MESSAGES[status]}
                </p>

               
                {status !== "Delivered" && (
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        marginTop: "16px",
                        background: "rgba(255,107,53,0.1)",
                        border: "1px solid rgba(255,107,53,0.2)",
                        borderRadius: "50px",
                        padding: "6px 16px",
                        fontSize: "13px", color: "var(--accent)", fontWeight: 600
                    }}>
                        ⏱ Estimated: 15-20 min
                    </div>
                )}
            </div>

      
            <div
                className="glass"
                style={{
                    borderRadius: "var(--radius-xl)",
                    padding: "36px 24px 28px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {STEPS.map((step, idx) => {
                        const completed = idx < currentIdx;
                        const active = idx === currentIdx;

                        return (
                            <div
                                key={step.key}
                                className={`status-step ${completed ? "completed" : ""} ${active ? "active" : ""}`}
                                data-testid={`status-step-${step.key.toLowerCase().replace(/ /g, "-")}`}
                            >
                                <div className="status-dot">
                                    {completed ? "✓" : step.icon}
                                </div>
                                <span className="status-label">{step.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}