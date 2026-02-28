import { body } from "express-validator";

export const postCreateValidation = [
     body('title', 'Введите заголов статьи').isLength({ min: 5 }).isString(),
     body('text', 'Введите текст статьи').isLength({ min: 5 }).isString(),
     body('tags', 'Неверный формат тегов').optional().isString(),
     body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]