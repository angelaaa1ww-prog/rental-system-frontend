const rawApi = process.env.REACT_APP_API_URL || "https://rental-system-backend-1t05.onrender.com";
const API = rawApi.endsWith('/api') ? rawApi.slice(0, -4) : rawApi;

export const getToken = () => {
  const t = localStorage.getItem('token');
  return (!t || t === 'undefined' || t === 'null') ? null : t;
};

export const authHeader = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const safeFetch = async (url, options = {}, onUnauth) => {
  try {
    const res  = await fetch(url, options);
    const data = await res.json().catch(() => null);
    if (res.status === 401) {
      localStorage.clear();
      if (onUnauth) onUnauth();
      return null;
    }
    if (!res.ok) return { __error: true, message: data?.message || 'Something went wrong' };
    return data;
  } catch {
    return { __error: true, message: 'Cannot reach server. Is your backend running?' };
  }
};

export { API };
export default API;