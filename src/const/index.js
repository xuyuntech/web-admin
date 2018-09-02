export const BaseURL = 'https://api.boxlinker.com';
export const DEV = process.env.NODE_ENV === 'development';
const DevURL = {
  INVENTORY_SYNC: 'http://localhost:8080',
};


function getURL(url, moduler) {
  if (DEV) {
    return `${DevURL[moduler]}${url}`;
  }
  return `${BaseURL}${url}`;
}

export const API = {
  INVENTORY_SYNC: {
    SYNC_ALL: getURL('/syncAll', 'INVENTORY_SYNC'),
    UPLOAD: getURL('/upload', 'INVENTORY_SYNC'),
    PARSING: getURL('/inventorySync/parsing', 'INVENTORY_SYNC'),
  },
};

export default {};
