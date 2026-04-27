// Next.js API utilities - Converted from React version

const normalizeBaseUrl = (baseUrl) => {
  if (!baseUrl) return '';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

const buildUrl = (baseUrl, pathOrUrl) => {
  if (!pathOrUrl) return normalizeBaseUrl(baseUrl);
  if (String(pathOrUrl).startsWith('http')) return pathOrUrl;

  const base = normalizeBaseUrl(baseUrl);
  const path = String(pathOrUrl).replace(/^\/+/, '');
  return new URL(path, base).toString();
};

// Environment variables for API URLs
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://liveapi.astrocall.live/api/');
  }

  const urlSet = window.location.origin;
  const base = urlSet === 'https://astrocall.live'
    ? 'https://api.astrocall.live/api/'  // Live domain
    : 'https://liveapi.astrocall.live/api/';  // Local development domain
  return normalizeBaseUrl(base);
};

// Get visitor ID from localStorage (client-side only)
const getVisitorId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('visitor_Id') || '';
  }
  return '';
};

// Get auth token from localStorage (client-side only)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const auth = localStorage.getItem('LoginTokenData');
    return auth ? JSON.parse(auth) : null;
  }
  return null;
};

// Refresh token utility
const refreshAuthToken = async () => {
  if (typeof window === 'undefined') return null;

  const auth = getAuthToken();
  if (!auth?.refresh_token) return null;

  try {
    const loginUrl = buildUrl(getApiUrl(), 'Astrologer/Astrologer_Login');
    const refreshVal = {
      refresh_token: auth.refresh_token,
      grant_type: 'refresh_token'
    };

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refreshVal),
    });

    const data = await response.json();
    const parseData = JSON.parse(data?.data);
    const Resdata = parseData?.Table;

    if (Resdata?.length > 0) {
      localStorage.setItem('LoginTokenData', JSON.stringify(Resdata[0]));
      return Resdata[0];
    } else {
      console.error('Token refresh failed: No data in response');
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    const Resdata = error?.response?.data?.Message;
    if (Resdata === 'Invalid Refresh Token') {
      localStorage.clear();
      sessionStorage.clear();
    }
    return null;
  }
};

// Basic GET request
export const fetchData = async (URL) => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

// POST request without token
export const getPostData = async (url, postData) => {
  try {
    const visitorId = getVisitorId();
    const fullUrl = buildUrl(getApiUrl(), url);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'FingerPrintJsKey': visitorId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();
    const parseData = JSON.parse(data?.data);
    return parseData?.Table;
  } catch (error) {
    console.error('Post data error:', error);
    return null;
  }
};

// GET request with token and auto-refresh
export const GetWithToken = async (url) => {
  const makeApiCall = async () => {
    const auth = getAuthToken();
    const visitorId = getVisitorId();
    const apiUrl = buildUrl(getApiUrl(), url);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'FingerPrintJsKey': visitorId,
        'Authorization': `Bearer ${auth?.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    // Token expired condition
    if (!response.ok && responseData?.Message === 'Authorization has been denied for this request.') {
      console.warn('Token expired. Trying refresh_token...');

      const newAuth = await refreshAuthToken();
      if (newAuth) {
        // Retry with new token
        return await makeApiCall();
      } else {
        return null;
      }
    }

    // Success case
    let finalData = responseData;
    if (typeof finalData === 'string') {
      try {
        finalData = JSON.parse(finalData);
      } catch (e) {
        console.warn('Could not parse nested JSON');
      }
    }

    return finalData || null;
  };

  return await makeApiCall();
};

// POST request with token and auto-refresh
export const postWithToken = async (url, postData) => {
  const makeApiCall = async () => {
    const auth = getAuthToken();
    const visitorId = getVisitorId();
    const apiUrl = buildUrl(getApiUrl(), url);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'FingerPrintJsKey': visitorId,
        'Authorization': `Bearer ${auth?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    const responseData = await response.json();

    // Token expired condition
    if (!response.ok && responseData?.Message === 'Authorization has been denied for this request.') {
      console.warn('Token expired. Trying refresh_token...');

      const newAuth = await refreshAuthToken();
      if (newAuth) {
        // Retry with new token
        return await makeApiCall();
      } else {
        return null;
      }
    }

    // Success case
    let finalData = responseData?.data;
    if (typeof finalData === 'string') {
      try {
        finalData = JSON.parse(finalData);
      } catch (e) {
        console.warn('Could not parse nested JSON');
      }
    }

    return finalData?.Table || null;
  };

  return await makeApiCall();
};

// POST/PUT/DELETE with token (for CRUD operations)
export const TokenWithDeleteUpadateAdd = async (url, postData) => {
  const makeApiCall = async () => {
    const auth = getAuthToken();
    const visitorId = getVisitorId();
    const apiUrl = buildUrl(getApiUrl(), url);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth?.access_token}`,
        'Content-Type': 'application/json',
        'FingerPrintJsKey': visitorId,
      },
      body: JSON.stringify(postData),
    });

    const responseData = await response.json();

    // Token expired condition
    if (!response.ok && responseData?.Message === 'Authorization has been denied for this request.') {
      console.warn('Token expired. Trying refresh_token...');

      const newAuth = await refreshAuthToken();
      if (newAuth) {
        // Retry with new token
        return await makeApiCall();
      } else {
        return null;
      }
    }

    // Success case
    let finalData = responseData;
    if (typeof finalData === 'string') {
      try {
        finalData = JSON.parse(finalData);
      } catch (e) {
        console.warn('Could not parse nested JSON');
      }
    }

    return finalData || null;
  };

  return await makeApiCall();
};

// Image upload with token
export const TokenImageUpload = async (url, formData) => {
  const makeApiCall = async () => {
    const auth = getAuthToken();
    const visitorId = getVisitorId();
    const apiUrl = buildUrl(getApiUrl(), url);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth?.access_token}`,
        'FingerPrintJsKey': visitorId,
        // Don't set Content-Type when sending FormData
      },
      body: formData,
    });

    const responseData = await response.json();

    // Token expired condition
    if (!response.ok && responseData?.Message === 'Authorization has been denied for this request.') {
      console.warn('Token expired. Trying refresh_token...');

      const newAuth = await refreshAuthToken();
      if (newAuth) {
        // Retry with new token
        return await makeApiCall();
      } else {
        return null;
      }
    }

    // Success case
    let finalData = responseData;
    if (typeof finalData === 'string') {
      try {
        finalData = JSON.parse(finalData);
      } catch (e) {
        console.warn('Could not parse nested JSON');
      }
    }

    return finalData || null;
  };

  return await makeApiCall();
};

// Ticket data POST with token
export const getPostTicketData = async (url, postData) => {
  const makeApiCall = async () => {
    const auth = getAuthToken();
    const visitorId = getVisitorId();
    const apiUrl = buildUrl(getApiUrl(), url);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth?.access_token}`,
          'Content-Type': 'application/json',
          'FingerPrintJsKey': visitorId,
        },
        body: JSON.stringify(postData),
      });

      const responseData = await response.json();

      // Token expired condition
      if (!response.ok && responseData?.Message === 'Authorization has been denied for this request.') {
        const newAuth = await refreshAuthToken();
        if (newAuth) {
          // Retry with new token
          return await makeApiCall();
        } else {
          return null;
        }
      }

      // Return full API response
      return responseData;

    } catch (error) {
      console.error('Error in getPostTicketData:', error);
      return null;
    }
  };

  return await makeApiCall();
};

// Simple POST/PUT/DELETE without token
export const AddDeleteUpadate = async (url, postData) => {
  try {
    const visitorId = getVisitorId();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'FingerPrintJsKey': visitorId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.status === 400) {
      return { code: 'ERR_BAD_REQUEST', data };
    } else {
      return data;
    }
  } catch (error) {
    console.error('Add/Update/Delete error:', error);
    return null;
  }
};

// Simple GET with data parsing
export const getData = async (url, postData) => {
  try {
    const fullUrl = buildUrl(getApiUrl(), url);
    const response = await fetch(fullUrl, postData);
    const data = await response.json();
    const parseData = JSON.parse(data?.data);
    return parseData?.Table;
  } catch (error) {
    console.error('Get data error:', error);
    return null;
  }
};

// Utility function to format array data
export const Comman_changeArrayFormat = (data, Id, Code, type, col3, col4) => {
  if (type === 'PretendToBeID') {
    const result = data?.map((sponsor) => ({
      value: sponsor[Id],
      label: sponsor[col4] + '-' + sponsor[Code],
      id: sponsor[col3]
    }));
    return result;
  } else {
    const result = data?.map((sponsor) => ({
      value: sponsor[Id],
      label: sponsor[Code]
    }));
    return result;
  }
};

// Get single user data by ID
export const Get_SingleData_User = async (id) => {
  if (!id) return null;
  
  try {
    const res = await postWithToken("User/GetSingleData_User", { UserID: id });
    if (res && res.length > 0) {
      return res[0];
    }
    return null;
  } catch (err) {
    console.error("Error fetching single user data:", err);
    return null;
  }
};

// Testing function (kept for compatibility)
export const fetchDataTesting = async (URL) => {
  if (typeof window === 'undefined') return null;

  const auth = JSON.parse(sessionStorage.getItem('auth'));
  const config = { headers: { Authorization: `Bearer ${auth.token}` } };

  try {
    const api = `${process.env.NEXT_PUBLIC_Base_URL || ''}${URL}`;
    const response = await fetch(api, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Testing fetch error:', error);
    return null;
  }
};
