// =============================================
// MpesaPayButton.js
// Allows admin to enter a custom amount before
// triggering STK push. Falls back to house rent
// if no amount entered.
// =============================================

import { useState } from "react";

const API = "https://rental-system-backend-1t05.onrender.com";

export default function MpesaPayButton({ tenantId, token, rentAmount }) {
  const [amount, setAmount]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState(null);
  const [polling, setPolling]     = useState(false);
  const [result, setResult]       = useState(null);

  // ── TRIGGER STK PUSH ──
  const triggerPay = async () => {
    // If admin left amount blank, use the house rent
    const finalAmount = amount ? Number(amount) : Number(rentAmount);

    if (!finalAmount || finalAmount <= 0) {
      alert("Enter a valid amount or make sure the tenant has a house assigned with rent set.");
      return;
    }

    setLoading(true);
    setStatus(null);
    setResult(null);

    try {
      const res = await fetch(`${API}/api/mpesa/pay`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        // ✅ Send the custom amount — backend will use this instead of house rent
        body: JSON.stringify({ tenantId, amount: finalAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setLoading(false);
        alert(data.message || "M-Pesa request failed");
        return;
      }

      setStatus("sent");
      const id = data.checkoutRequestId;
      setLoading(false);
      pollStatus(id);

    } catch {
      setStatus("error");
      setLoading(false);
      alert("Network error — is your backend running?");
    }
  };

  // ── POLL FOR CONFIRMATION ──
  const pollStatus = (id) => {
    setPolling(true);
    let attempts = 0;
    const max = 15;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res  = await fetch(`${API}/api/mpesa/status/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.status === "confirmed") {
          clearInterval(interval);
          setPolling(false);
          setResult("confirmed");
          setAmount(""); // clear input after success
          return;
        }
        if (data.status === "failed") {
          clearInterval(interval);
          setPolling(false);
          setResult("failed");
          return;
        }
      } catch { /* ignore polling blips */ }

      if (attempts >= max) {
        clearInterval(interval);
        setPolling(false);
        setResult("timeout");
      }
    }, 4000);
  };

  return (
    <div style={{ marginTop: 10 }}>

      {/* Amount input + Pay button side by side */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="number"
          placeholder={rentAmount ? `House rent: KES ${Number(rentAmount).toLocaleString()} (or enter custom)` : "Enter amount (KES)"}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          disabled={loading || polling}
          style={{
            flex:         1,
            minWidth:     180,
            padding:      "10px 13px",
            border:       "1.5px solid #4CAF50",
            borderRadius: 9,
            fontSize:     14,
            fontFamily:   "'DM Sans', sans-serif",
            outline:      "none",
            background:   "white",
            color:        "#1a1a1a",
          }}
        />
        <button
          onClick={triggerPay}
          disabled={loading || polling}
          style={{
            padding:        "10px 18px",
            background:     loading || polling ? "#aaa" : "#4CAF50",
            color:          "white",
            border:         "none",
            borderRadius:   9,
            fontSize:       14,
            fontWeight:     700,
            fontFamily:     "'DM Sans', sans-serif",
            cursor:         loading || polling ? "not-allowed" : "pointer",
            whiteSpace:     "nowrap",
            transition:     "background 0.2s",
          }}
        >
          {loading
            ? "⏳ Sending..."
            : polling
            ? "⏳ Waiting for PIN..."
            : "📲 Pay via M-Pesa"}
        </button>
      </div>

      {/* Hint text */}
      {!status && (
        <p style={{ fontSize: 11, color: "#aaa", marginTop: 5 }}>
          Leave blank to charge house rent amount. Enter custom amount for arrears or partial payments.
        </p>
      )}

      {/* Prompt sent */}
      {status === "sent" && !result && (
        <div style={{ marginTop: 8, padding: "10px 14px", background: "#E1F5EE", borderRadius: 9 }}>
          <p style={{ color: "#0F6E56", fontWeight: 600, fontSize: 13 }}>
            ✅ M-Pesa prompt sent — KES {amount || rentAmount} requested
          </p>
          <p style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
            Ask tenant to check their phone and enter M-Pesa PIN.
          </p>
          {polling && (
            <p style={{ color: "#888", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>
              ⏳ Checking for confirmation every 4 seconds...
            </p>
          )}
        </div>
      )}

      {/* Confirmed */}
      {result === "confirmed" && (
        <div style={{ marginTop: 8, padding: "10px 14px", background: "#E1F5EE", borderRadius: 9 }}>
          <p style={{ color: "#0F6E56", fontWeight: 700, fontSize: 14 }}>
            🎉 Payment confirmed! KES {amount || rentAmount} received.
          </p>
          <p style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
            SMS receipt sent to tenant automatically.
          </p>
        </div>
      )}

      {/* Failed */}
      {result === "failed" && (
        <div style={{ marginTop: 8, padding: "10px 14px", background: "#FCEBEB", borderRadius: 9 }}>
          <p style={{ color: "#A32D2D", fontWeight: 600, fontSize: 13 }}>
            ❌ Payment cancelled or failed. Please try again.
          </p>
        </div>
      )}

      {/* Timeout */}
      {result === "timeout" && (
        <div style={{ marginTop: 8, padding: "10px 14px", background: "#FAEEDA", borderRadius: 9 }}>
          <p style={{ color: "#854F0B", fontWeight: 600, fontSize: 13 }}>
            ⏱️ No response after 60s. Check Payments page to confirm if it went through.
          </p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div style={{ marginTop: 8, padding: "10px 14px", background: "#FCEBEB", borderRadius: 9 }}>
          <p style={{ color: "#A32D2D", fontWeight: 600, fontSize: 13 }}>
            ❌ Could not send M-Pesa prompt. Check your backend logs.
          </p>
        </div>
      )}

    </div>
  );
}
