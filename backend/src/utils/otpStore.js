const store = new Map();

export const saveOTP = (email, otp) => {
  store.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
};

export const verifyOTP = (email, otp) => {
  const data = store.get(email);
  if (!data) return false;
  if (Date.now() > data.expiresAt) {
    store.delete(email);
    return false;
  }
  return data.otp === otp;
};

export const clearOTP = (email) => {
  store.delete(email);
};
