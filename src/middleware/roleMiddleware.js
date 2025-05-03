const roleHierarchy = {
    admin: ['admin', 'company', 'user'],
    company: ['company', 'user'],
    user: ['user']
  };
  
  const requireRole = (requiredRole) => {
    return (req, res, next) => {
      const userRole = req.user.role;
      
      if (!roleHierarchy[userRole]?.includes(requiredRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires ${requiredRole} role.`
        });
      }
      
      next();
    };
  };
  
  
  const requireAnyRole = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`
        });
      }
      
      next();
    };
  };
  
  
  const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    next();
  };
  
  module.exports = {
    requireRole,
    requireAnyRole,
    adminOnly
  };