const express = require('express');
const { Transaction, Category } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { UserId: req.user.id },
      include: [Category],
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const { amount, description, type, categoryId, date } = req.body;
    const transaction = await Transaction.create({
      amount,
      description,
      type,
      date: date || new Date(),
      CategoryId: categoryId,
      UserId: req.user.id
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id, UserId: req.user.id }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.update(req.body);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error updating transaction' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.destroy({
      where: { id, UserId: req.user.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

module.exports = router;