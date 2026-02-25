import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm() {
    const { cart, clearCart } = useCart();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", address: "", phone: "" });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.address.trim()) errs.address = "Address is required";
        if (!form.phone.trim()) errs.phone = "Phone is required";
        else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({ menuItem: item._id, quantity: item.quantity })),
                customer: form,
            };

            const res = await API.post("/orders", orderData);
            clearCart();
            addToast("Order placed successfully! 🎉", "success");
            navigate(`/order/${res.data._id}`);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to place order. Please try again.";
            addToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const fieldStyle = (hasError) => ({
        position: "relative",
        marginBottom: hasError ? "4px" : "16px",
    });

    return (
        <form
            id="checkout-form"
            onSubmit={handleSubmit}
            noValidate
            style={{ marginTop: "24px" }}
        >
            <h3 style={{
                fontSize: "16px", fontWeight: 700,
                color: "var(--text-primary)", marginBottom: "16px",
                display: "flex", alignItems: "center", gap: "8px"
            }}>
                <span>📦</span> Delivery Details
            </h3>

        
            <div style={fieldStyle(errors.name)}>
                <div style={{ position: "relative" }}>
                    <span style={{
                        position: "absolute", left: "14px", top: "50%",
                        transform: "translateY(-50%)", fontSize: "15px"
                    }}>👤</span>
                    <input
                        id="checkout-name"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="input-field"
                        style={{
                            paddingLeft: "42px",
                            borderColor: errors.name ? "var(--error)" : undefined,
                            marginBottom: 0
                        }}
                    />
                </div>
                {errors.name && <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", marginBottom: "12px" }}>{errors.name}</p>}
            </div>

            
            <div style={fieldStyle(errors.address)}>
                <div style={{ position: "relative" }}>
                    <span style={{
                        position: "absolute", left: "14px", top: "14px",
                        fontSize: "15px"
                    }}>📍</span>
                    <textarea
                        id="checkout-address"
                        name="address"
                        placeholder="Delivery Address"
                        value={form.address}
                        onChange={handleChange}
                        rows={2}
                        className="input-field"
                        style={{
                            paddingLeft: "42px", resize: "none",
                            borderColor: errors.address ? "var(--error)" : undefined,
                            marginBottom: 0
                        }}
                    />
                </div>
                {errors.address && <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", marginBottom: "12px" }}>{errors.address}</p>}
            </div>

            {/* Phone */}
            <div style={fieldStyle(errors.phone)}>
                <div style={{ position: "relative" }}>
                    <span style={{
                        position: "absolute", left: "14px", top: "50%",
                        transform: "translateY(-50%)", fontSize: "15px"
                    }}>📞</span>
                    <input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-field"
                        style={{
                            paddingLeft: "42px",
                            borderColor: errors.phone ? "var(--error)" : undefined,
                            marginBottom: 0
                        }}
                    />
                </div>
                {errors.phone && <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", marginBottom: "12px" }}>{errors.phone}</p>}
            </div>

            <button
                id="place-order-btn"
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: "100%", marginTop: "8px", padding: "14px" }}
            >
                {loading ? <><span className="spinner" /> Placing Order...</> : "🛍 Place Order ₹"}
            </button>
        </form>
    );
}