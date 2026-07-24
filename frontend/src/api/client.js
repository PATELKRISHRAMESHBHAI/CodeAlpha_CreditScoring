const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5051";

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export function fetchCreditInfo() {
  return request("/api/credit/info");
}

export function fetchCreditForm() {
  return request("/api/credit/form");
}

export function predictCredit(values) {
  return request("/api/predict/credit", {
    method: "POST",
    body: JSON.stringify(values),
  });
}
