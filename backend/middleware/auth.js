import jwt from 'jsonwebtoken'

function extractToken(req) {
  const header = req.headers.authorization
  return header?.startsWith('Bearer ') ? header.slice(7) : null
}

// Verify any valid JWT (user, admin, or sales)
export function verifyToken(req, res, next) {
  const token = extractToken(req)
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// Only allow requests where token role === 'admin'
export function requireAdmin(req, res, next) {
  const token = extractToken(req)
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access only.' })
    }
    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// Only allow requests where token role === 'sales'
export function requireSales(req, res, next) {
  const token = extractToken(req)
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'sales') {
      return res.status(403).json({ message: 'Forbidden. Sales access only.' })
    }
    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// Allow any of the given roles — usage: requireRole('admin', 'sales')
export function requireRole(...roles) {
  return (req, res, next) => {
    const token = extractToken(req)
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message: `Forbidden. Requires one of: ${roles.join(', ')}.`,
        })
      }
      req.user = decoded
      return next()
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token.' })
    }
  }
}
