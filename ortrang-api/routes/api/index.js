var express = require('express');
var router = express.Router();
const userController = require("../../controllers/api/usersController");

/* GET home page. */
/* http://localhost:3000/user/ */
router.get('/', userController.index);
/* http://localhost:3000/user/${lineid} */
router.get('/:lineid', userController.show);
/* http://localhost:3000/user/ */
router.post('/', userController.insert);
/* http://localhost:3000/user/${id} */
router.delete('/:id', userController.destroy);
/* http://localhost:3000/user/${id} */
router.put('/:id', userController.update);

module.exports = router;
