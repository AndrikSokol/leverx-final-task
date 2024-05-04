export const SUCCESS_STRIPE = (
  vinylsName: string,
  totalPrice: number,
) => `<h2>Your Payment Was Successful!</h2>
<p>We are pleased to inform you that your payment was successfully processed. Thank you for your purchase!</p>
<p>Here are the details of your order:</p>
<ul>
  <li>Products:${vinylsName}</li>
  <li>Price: $${totalPrice}</li>
</ul>
<p>If you have any questions or concerns, feel free to contact us.</p>
<p>Thank you</p>
`;

export const CANCELED_STRIPE = `
  <h2>Your Payment Was Canceled</h2>
  <p>If you have any questions or concerns regarding the cancellation, please feel free to contact us.</p>
  <p>Thank you for considering our service.</p>
`;
