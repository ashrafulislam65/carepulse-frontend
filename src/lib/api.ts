const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
export const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

const TOKEN_KEY = "cp_token";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string | null) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

type Options = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
};

export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { ...opts.headers };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token && opts.auth !== false) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const first = json?.errors?.[0];
    const msg = first ? `${first.path}: ${first.message}` : json?.message ?? "Request failed";
    throw new ApiError(res.status, msg);
  }
  return json?.data as T;
}

// PDF/invoice-er moto authenticated file download
export async function downloadFile(path: string, filename: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new ApiError(res.status, "Download failed");
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}