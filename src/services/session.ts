type SessionReturn = {
  token: string | null;
  id: string | null;
  userRole: string | null;
  userName: string | null;
  phoneNumber: string | null;
};

function getSessionItem(key: string): string | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as string;
  } catch {
    return raw;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("id");
  sessionStorage.removeItem("userRole");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("phoneNumber");
}

// function to get session data
export function getSession(): SessionReturn {
  return {
    token: getSessionItem("token"),
    id: getSessionItem("id"),
    userRole: getSessionItem("userRole"),
    userName: getSessionItem("userName"),
    phoneNumber: getSessionItem("phoneNumber"),
  };
}
