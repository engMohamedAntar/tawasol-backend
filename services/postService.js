//postService.js
const User = require("../models/User");
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const user = await User.findById(req.user.id);
  const post = new Post({
    name: user.name,
    user: req.user.id,
    text: req.body.text,
  });
  await post.save();
  res.status(201).json(post);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.status(200).json({ posts });
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.status(200).json({ post });
};

exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (
    post.likes.some((like) => like.user.toString() === req.user.id.toString())
  )
    return res.status(400).json({ error: "Post already liked" });

  post.likes.push({ user: req.user.id });
  await post.save();
  res.status(200).json(post);
};

exports.unlikePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (
    !post.likes.some((like) => like.user.toString() === req.user.id.toString())
  ) {
    return res
      .status(400)
      .json({ msg: "User has not liked the post previously!" });
  }
  post.likes = post.likes.filter(
    (like) => like.user.toString() !== req.user.id.toString(),
  );
  await post.save();
  res.status(200).json(post);
};

exports.createComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  const user = await User.findById(req.user.id);
  
  const comment = {
    user: req.user.id,
    text: req.body.text,
    name: user.name
  };

  post.comments.unshift(comment);
  await post.save();
  res.status(201).json(post);
};

exports.deleteComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const comment = post.comments.find((comment) => {
    return comment.id === req.params.comment_id;
  });
  if (!comment) {
    return res.status(404).json({ msg: "Comment does not exist" });
  }

  if (comment.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: "User is not authorized" });
  }

  post.comments = post.comments.filter((comment) => {
    return comment.id !== req.params.comment_id;
  });

  await post.save();
  res.status(200).json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  if (post.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: "User is not authorized" });
  }

  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({ msg: "Post removed" });
};
