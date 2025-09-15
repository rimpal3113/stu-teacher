const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied. No user role found." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    next();
  };
};

// Explicit admin-only middleware
export function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. No user role found." });
  }
  next();
}

export { roleMiddleware };
export default roleMiddleware;