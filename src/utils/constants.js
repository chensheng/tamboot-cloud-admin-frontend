export const BusinessCode = {
  SUCCESS: '1',
  FAIL: '0',
  UNAUTHENTICATED: '1001',
  ACCESS_DENIED: '1002',
  EXCEPTION: '9999',
};

export const Status = {
  ENABLE: 1,
  DISABLE: 0,
};

export const RegPattern = {
  PASSWORD: /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/,
};
