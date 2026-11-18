import React from "react";
import { formatEUR, parsePrice } from "../../utils/checkoutHelpers";

export default function OrderSummary({ safeCart, isSubscription, country, subtotal }) {
  return (
    <div className="ckSummary">
      {isSubscription ? (
        <div className="ckItem">
          <div className="ckThumbWrap">
            <span className="ckQtyBubble">1</span>
          </div>
          <div className="ckItemTitle">Abonnement Annuel Atlasia Kids</div>
          <div className="ckItemPrice">{formatEUR(subtotal)}</div>
        </div>
      ) : (
        safeCart.map((item) => {
          const unitPrice = country === "Suisse" ? 8.99 : parsePrice(item.price);
          return (
            <div className="ckItem" key={item._id || item.productId}>
              <div className="ckThumbWrap">
                {item.image && <img src={item.image} alt={item.title} className="ckThumb" />}
                <span className="ckQtyBubble">{item.quantity || 1}</span>
              </div>
              <div className="ckItemTitle">{item.title}</div>
              <div className="ckItemPrice">{formatEUR(unitPrice * Number(item.quantity || 1))}</div>
            </div>
          );
        })
      )}

      <div className="ckTotals">
        <div className="ckLine">
          <span>Sous-total</span>
          <strong>{formatEUR(subtotal)}</strong>
        </div>
        <div className="ckLine">
          <span>Expédition</span>
          <span className="ckMuted">Gratuite</span>
        </div>
        <div className="ckLine ckBig">
          <span>Total</span>
          <div>
            <span className="ckCurrency">EUR</span>
            {formatEUR(subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
}
