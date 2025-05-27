import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { protect } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all matters for a customer
router.get('/:customerId/matters', protect, async (req, res, next) => {
  try {
    const matters = await prisma.matter.findMany({
      where: { customerId: Number(req.params.customerId) }
    });

    res.json({
      status: 'success',
      data: { matters }
    });
  } catch (error) {
    next(error);
  }
});

// Create a matter for a customer
router.post('/:customerId/matters', protect, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const customerId = Number(req.params.customerId);

    if (!title) {
      throw new AppError('Title is required', 400);
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const matter = await prisma.matter.create({
      data: {
        title,
        description,
        customerId
      }
    });

    res.status(201).json({
      status: 'success',
      data: { matter }
    });
  } catch (error) {
    next(error);
  }
});

// Get matter details
router.get('/:customerId/matters/:matterId', protect, async (req, res, next) => {
  try {
    const matter = await prisma.matter.findFirst({
      where: {
        id: Number(req.params.matterId),
        customerId: Number(req.params.customerId)
      }
    });

    if (!matter) {
      throw new AppError('Matter not found', 404);
    }

    res.json({
      status: 'success',
      data: { matter }
    });
  } catch (error) {
    next(error);
  }
});

export const matterRouter = router; 