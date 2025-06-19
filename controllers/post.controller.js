const Post = require('../models/post.model');
const { v4: uuidv4 } = require('uuid');
const Interaction = require('../models/interaction.model');

exports.createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const newPost = new Post({
      postId: uuidv4(),
      userId: req.user.userId,
      title,
      content,
      image
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch blocked users and users who blocked you
    const blocks = await Interaction.find({
      $or: [
        { userId, action: 'block' },
        { targetUserId: userId, action: 'block' }
      ]
    });

    const blockedUserIds = blocks.map(b => b.userId === userId ? b.targetUserId : b.userId);

    const posts = await Post.find({
      userId: { $nin: blockedUserIds }
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};