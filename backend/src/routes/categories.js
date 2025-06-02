const express = require('express');
const { Category } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { UserId: req.user.id }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Create category
router.post('/', auth, async (req, res) => {
  try {
    const { name, color } = req.body;
    const category = await Category.create({
      name,
      color,
      UserId: req.user.id
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
});

// Update category
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      where: { id, UserId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({
      where: { id, UserId: req.user.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
});

module.exports = router;