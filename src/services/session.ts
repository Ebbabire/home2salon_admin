type SessionReturn = {
  token: string | null;
  id: string;
  userRole: string;
  userName: string;
  phoneNumber: string;
};

// function to get session data
export function getSession(): SessionReturn {
  const token = JSON.parse(sessionStorage.getItem("token") || "{}");
  const id = JSON.parse(sessionStorage.getItem("id") || "{}");
  const userRole = JSON.parse(sessionStorage.getItem("userRole") || "{}");
  const userName = JSON.parse(sessionStorage.getItem("userName") || "{}");
  const phoneNumber = JSON.parse(sessionStorage.getItem("phoneNumber") || "{}");

  return {
    token,
    id,
    userRole,
    userName,
    phoneNumber,
  };
}
