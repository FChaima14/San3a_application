import express from 'express'
import { createPost, deletePost, getPost, updatePost, likePost, searchPost, getPostById } from '../controlers/post.js'
import auth from '../middleware/auth.js'

const routes=express.Router()

routes.get('/', getPost)
routes.get('/:id', getPostById)
routes.get('/search', searchPost)
routes.post('/create', auth, createPost)
routes.patch('/:id',auth,  updatePost)
routes.delete('/:id',auth,  deletePost)
routes.patch('/:id/like',auth, likePost )
export default routes;