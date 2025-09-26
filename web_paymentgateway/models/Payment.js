import dotenv from 'dotenv';
import Xendit from 'xendit-node';

dotenv.config();

const x = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
const { EWallet } = x;
const ew = new EWallet();

async function createPayment() {
  try {
    const charge = await ew.createPayment({
      referenceID: 'demo-transaction-001',
      currency: 'IDR',
      amount: 10000,
      checkoutMethod: 'ONE_TIME_PAYMENT',
      channelCode: 'ID_OVO',
      channelProperties: {
        mobileNumber: '08123456789',
      },
    });
    console.log(charge);
  } catch (err) {
    console.error(err);
  }
}

// panggil fungsi createPayment kalau mau langsung test
createPayment();
