import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation } from "./validations/auth.js";
import { loginValidation } from "./validations/login.js";
import { postCreateValidation } from "./validations/post-create.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js"
import { UserControllers, PostControllers} from "./controllers/index.js";

mongoose
     .connect('mongodb+srv://admin:123@cluster0.rmgd20b.mongodb.net/blog?appName=Cluster0')
     .then(() => console.log('DataBase OK'))
     .catch((err) => console.log('DataBase Error', err))

const app = express();

const storage = multer.diskStorage({
     destination: (_, __, cb) => {
          cb(null, 'uploads');
     },
     filename: (_, file, cb) => {
          cb(null, file.originalname)
     }
})

const upload = multer({ storage })

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handleValidationErrors, UserControllers.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserControllers.login)
app.get('/auth/me', checkAuth, UserControllers.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
     res.json({
          url: `/uploads/${req.file.originalname}`
     })
})

app.get('/tags', PostControllers.getLastTags);

app.get('/posts', PostControllers.getAll)
app.get('/posts/tags', PostControllers.getLastTags);
app.get('/posts/:id', PostControllers.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostControllers.create)
app.delete('/posts/:id', checkAuth, PostControllers.removePost)
app.patch('/posts/:id', postCreateValidation, handleValidationErrors, PostControllers.updatePost)

app.listen(444, (err) => {
     if (err) {
          return console.log("Server Error")
     }

     console.log("Server OK")
});