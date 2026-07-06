const normalizeBaseUrl = (baseUrl) => {
  if (!baseUrl) return '';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

const getServerApiUrl = () => {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://liveapi.astrocall.live/api/'
  );
};

/**
 * Server-side fetch for PrivacyPolicy/GetData_PrivacyPolicy (same endpoint as client postWithToken).
 */
export async function fetchPolicyPageData(payload) {
  try {
    const url = `${getServerApiUrl()}PrivacyPolicy/GetData_PrivacyPolicy`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        FingerPrintJsKey: '',
      },
      body: JSON.stringify(payload),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    let parsed = data?.data;

    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }

    return parsed?.Table ?? null;
  } catch (error) {
    console.error('fetchPolicyPageData error:', error);
    return null;
  }
}
