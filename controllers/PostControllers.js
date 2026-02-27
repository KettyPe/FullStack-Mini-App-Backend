import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
     try {
          const posts = await PostModel.find().limit(5).exec()

          const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)

          return res.json(tags)
     } catch (err) {
          console.log(err);

          res.status(500).json({
               message: 'Ошибка получения тегов'
          })
     }
}

export const getAll = async (req, res) => {
     try {
          const posts = await PostModel.find().populate('user').exec()

          return res.json(posts)
     } catch (err) {
          console.log(err);

          res.status(500).json({
               message: 'Ошибка получения статей'
          })
     }
}

export const create = async (req, res) => {
     try {
          const docPost = new PostModel({
               title: req.body.title,
               text: req.body.text,
               tags: req.body.tags,
               imageUrl: req.body.imageUrl,
               user: req.userId,
          })

          const post = await docPost.save();

          res.json(post);
     } catch (err) {
          console.log(err);

          res.status(500).json({
               message: 'Ошибка создания поста'
          })
     }
}

export const getOne = async (req, res) => {
     try {
          const postId = req.params.id;

          const doc = await PostModel.findOneAndUpdate(
               {
                    _id: postId,
               },
               {
                    $inc: { viewsCount: 1 },
               },
               {
                    returnDocument: 'after',
               },
          ).populate('user')

          if (!doc) {
               return res.status(404).json({
                    message: 'Статья не найдена'
               })
          }

          res.json(doc)

     } catch (err) {
          console.log(err);

          res.status(500).json({
               message: 'Ошибка получения статей'
          })
     }
}

export const removePost = async (req, res) => {
     try {
          const postId = req.params.id;

          const doc = await PostModel.findOneAndDelete(postId)

          if (!doc) {
               return res.status(404).json({
                    message: 'Статья не найдена'
               })
          }

          res.json({
               success: true
          })

     } catch (err) {
          console.log(err);

          res.status(500).json({
               message: 'Ошибка удаления статьи'
          })
     }
}

export const updatePost = async (req, res) => {
     try {
          const postId = req.params.id;

          await PostModel.updateOne(
               {
                    _id: postId,
               },
               {
                    title: req.body.title,
                    text: req.body.text,
                    tags: req.body.tags,
                    user: req.userId,
               }
          )


          res.json({
               success: true
          })

     } catch (err) {
          console.log(err);

          res.status(500).json({
               message: 'Ошибка обновить статью'
          })
     }
}