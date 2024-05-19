const express = require("express");
const uploadImage = require("../../../uploadImage");
const router = express.Router();

router.post(`/uploadImage`, async (req, res) => {
  uploadImage(req.body.image, req.body.folder)
    .then((url) => res.send(url))
    .catch((err) => res.send(500).send(err));
});

module.exports = router;
