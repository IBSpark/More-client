import React from "react";
import "./Pricing.css";

export default function Pricing() {

const handleBuy = async (plan) => {

  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/api/create-checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ plan })
    }
  );

  const data = await res.json();

  window.location.href = data.url;

};

return (

<div className="pricing-page">

<h2>Upgrade Your Credits</h2>

<div className="pricing-grid">

<div className="plan">
<h3>Starter</h3>
<p>1000 Credits</p>
<h4>$5</h4>
<button onClick={() => handleBuy("starter")}>
Buy
</button>
</div>

<div className="plan">
<h3>Pro</h3>
<p>5000 Credits</p>
<h4>$15</h4>
<button onClick={() => handleBuy("pro")}>
Buy
</button>
</div>

<div className="plan">
<h3>Business</h3>
<p>20000 Credits</p>
<h4>$40</h4>
<button onClick={() => handleBuy("business")}>
Buy
</button>
</div>

</div>

</div>

);

}