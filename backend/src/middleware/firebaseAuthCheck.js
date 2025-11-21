// Verifies Firebase ID tokens sent from client in Authorization: Bearer <token>
const { admin } = require('../config/firebaseAdmin');
const User = require('../models/userModel');


module.exports = async function firebaseAuthCheck(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    // Fetch user from database to get role and other info
    const user = await User.findOne({ firebaseUid: decoded.uid });
    
    if (user) {
      // Combine Firebase auth data with database user data
      req.user = {
        ...decoded,
        role: user.role,
        userId: user._id,
        email: user.email,
      };
    } else {
      // User exists in Firebase but not in database yet
      // This happens during registration before sync completes
      req.user = {
        ...decoded,
        role: null, // No role until synced to database
      };
    }
    
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid', error: err.message });
  }
};