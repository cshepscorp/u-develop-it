const express = require('express'); // import express
const router = express.Router(); // import router so we can route from anywhere

router.use(require('./candidateRoutes')); //only import the candidate routes for now to make it easier to test as we shuffle things around.
router.use(require('./partyRoutes'));
router.use(require('./voterRoutes'));
router.use(require('./voteRoutes'));

module.exports = router;

