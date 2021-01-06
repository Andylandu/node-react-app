const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return callback({ file: 'File must be an image' });
        };

        return callback(undefined, true);
    }
});

module.exports = upload;