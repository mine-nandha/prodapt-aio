export const store = new Map();

//set/update an OTP and it's expiration time, then after the time ends clear the otp
export function setOtp(email, otp) {
  let timerId = setTimeout(
    () => store.delete(email),
    process.env.OTP_EXPIRATION_TIME
  );
  if (store.has(email)) {
    clearTimeout(store.get(email).timerId);
  }
  store.set(email, { otp, timerId });
}

//get the stored OTP if available
export function getOtp(email) {
  if (store.has(email)) {
    return store.get(email).otp;
  } else {
    return null;
  }
}

//clear the stored OTP
export function deleteOtp(email) {
  if (store.has(email)) {
    clearTimeout(store.get(email).timerId);
    store.delete(email);
  }
}
