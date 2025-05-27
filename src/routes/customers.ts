import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { protect } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all customers
router.get('/', protect, async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json({
      status: 'success',
      data: { customers }
    });
  } catch (error) {
    next(error);
  }
});

// Create customer
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name) {
      throw new AppError('Name is required', 400);
    }

    const customer = await prisma.customer.create({
      data: { name, phone }
    });

    res.status(201).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
});

// Get customer by ID
router.get('/:id', protect, async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    res.json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
});

// Update customer
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const customer = await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: { name, phone }
    });

    res.json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      next(new AppError('Customer not found', 404));
    } else {
      next(error);
    }
  }
});

// Delete customer
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await prisma.customer.delete({
      where: { id: Number(req.params.id) }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      next(new AppError('Customer not found', 404));
    } else {
      next(error);
    }
  }
});

export const customerRouter = router; 