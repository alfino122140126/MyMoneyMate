const express = require('express');
const { Budget } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all budgets
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      where: { UserId: req.user.id }
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

// Create budget
router.post('/', auth, async (req, res) => {
  try {
    const { amount, startDate, endDate } = req.body;
    const budget = await Budget.create({
      amount,
      startDate,
      endDate,
      UserId: req.user.id
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error creating budget' });
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({
      where: { id, UserId: req.user.id }
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await budget.update(req.body);
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error updating budget' });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Budget.destroy({
      where: { id, UserId: req.user.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting budget' });
  }
});

module.exports = router;