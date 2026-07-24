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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const safeFetch = async (url, options = {}, onUnauth, maxRetries = 2) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { __error: true, isOffline: true, message: 'You are currently offline. Please check your internet connection.' };
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const fetchOptions = {
        ...options,
        signal: controller.signal
      };

      const res = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        // Token invalid or expired
        localStorage.clear();
        if (onUnauth) onUnauth();
        return null;
      }

      // If server error (502, 503, 504 - e.g. Render waking up) and we have retries left
      if ((res.status >= 502 && res.status <= 504) && attempt < maxRetries) {
        await delay(1200 * (attempt + 1));
        continue;
      }

      if (!res.ok) {
        return { __error: true, status: res.status, message: data?.message || `Server returned error status ${res.status}` };
      }

      return data;
    } catch (err) {
      if (attempt < maxRetries) {
        await delay(1500 * (attempt + 1));
        continue;
      }
      return { 
        __error: true, 
        isNetworkError: true, 
        message: err.name === 'AbortError' 
          ? 'Server request timed out. Retrying...' 
          : 'Cannot reach server. Is your backend running?' 
      };
    }
  }

  return { __error: true, message: 'Server unreachable after multiple retries.' };
};

export { API };
export default API;