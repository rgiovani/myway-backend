import { diskStorage, Options } from 'multer';

const multerConfig: Options = {
    storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
};
//${Date.now()}-
module.exports = multerConfig;
