const BASE = "https://taskly-41ok.onrender.com/api";

export async function api(path, method = "GET", body) {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // some replies have no body, that is fine
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}