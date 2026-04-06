export const saveToken = (token) => localStorage.setItem('token', token)
export const getToken = () => localStorage.getItem('token')
export const clearToken = () => localStorage.removeItem('token')
export const getUserRole = () => localStorage.getItem('role')
export const saveUserRole = (role) => localStorage.setItem('role', role)
export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}
