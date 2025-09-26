import { EWallet } from "../lib/xendit.js";

const ew = new EWallet();

export async function createEwalletPayment({ referenceID, amount, mobileNumber }) {
  try {
    const charge = await ew.createPayment({
      referenceID,
      currency: "IDR",
      amount,
      checkoutMethod: "ONE_TIME_PAYMENT",
      channelCode: "ID_OVO", // bisa diganti OVO, DANA, dll
      channelProperties: { mobileNumber },
    });
    return charge;
  } catch (err) {
    console.error("Xendit error:", err);
    throw err;
  }
}
