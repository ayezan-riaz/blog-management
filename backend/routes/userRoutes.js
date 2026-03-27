const express = require('express');
const router = express.Router();
const {
  getUsers,
  changeUserRole,
  deleteUser,
  getDashboardStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { roleAuth } = require('../middleware/roleAuth');

// All routes are admin-only
router.use(protect, roleAuth('admin'));

router.get('/', getUsers);
router.get('/stats', getDashboardStats);
router.put('/:id/role', changeUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
