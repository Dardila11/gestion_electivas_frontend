export function closeSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("semester");
    localStorage.removeItem("role");
}