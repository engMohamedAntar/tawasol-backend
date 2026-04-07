const express= require('express');
const { protect } = require('../services/authService');
const { createPost, getPosts, getPost, likePost, unlikePost, createComment, deleteComment, deletePost } = require('../services/postService');
const { createPostValidator, createCommentValidator } = require('../validators/postValidator');
const router= express.Router();
/*
1. POST /posts
2. GET /posts
3. GET /posts/:id
4. DELETE /posts/:id
5. PUT /posts/like/:id
6. PUT /posts/unlike/:id
7. POST /posts/comment/:id
8. DELETE /posts/comment/:id/:comment_id
*/
router.post('/', protect, createPostValidator, createPost);
router.get('/', protect, getPosts);
router.get('/:id', protect, getPost);

router.put('/like/:id', protect, likePost);
router.delete('/unlike/:id', protect, unlikePost);

router.post('/comment/:id', protect, createCommentValidator, createComment);
router.delete('/comment/:id/:comment_id', protect, deleteComment);

router.delete('/:id', protect, deletePost);

module.exports= router;