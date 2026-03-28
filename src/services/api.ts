import { clearSession, getSession } from "./session";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface PaginatedResponse<T> {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: { [key: string]: T };
}

async function readJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}                

function getMessageFromBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  const message = record.message ?? record.error;
  return typeof message === "string" && message.trim().length ? message : fallback;
}

type ApiBody = undefined | null | string | number | boolean | object | FormData;

export type ApiFetchOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: ApiBody;
  headers?: Record<string, string>;
  auth?: boolean;
  unwrapData?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  {
    body,
    headers: extraHeaders,
    auth = true,
    unwrapData = true,
    ...init
  }: ApiFetchOptions = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const headers: Record<string, string> = {
    ...(extraHeaders ?? {}),
  };

  // Only set JSON content-type when we actually send JSON.
  // For FormData, the browser must set the multipart boundary.
  if (!isFormData && body !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  if (auth) {
    const { token } = getSession();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...init,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await readJsonSafe(res);
    const message = getMessageFromBody(errorBody, `Request failed (${res.status})`);

    if (res.status === 401 && auth) {
      clearSession();
      window.location.href = "/login";
    }

    throw new ApiError(message, res.status, errorBody);
  }

  const json = await readJsonSafe(res);
  const maybeRecord = json as Record<string, unknown> | undefined;
  return (unwrapData ? (maybeRecord?.data ?? json) : json) as T;
}

