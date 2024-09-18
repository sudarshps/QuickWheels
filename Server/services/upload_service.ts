import multer,{StorageEngine} from 'multer'
import path from 'path'


const storage:StorageEngine = multer.diskStorage({
    
    destination:(req,file,cb) => {
        
        cb(null,'uploads/')
    },
    filename:(req,file,cb) => {
        cb(null,Date.now()+path.extname(file.originalname))
    }
})


const upload = multer({storage})

export default upload
