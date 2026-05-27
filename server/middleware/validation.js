import { z } from 'zod';

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['Admin', 'Resident', 'Security'], { errorMap: () => ({ message: 'Invalid role' }) }),
  gender: z.string().optional(),
  flatNo: z.string().optional(),
  phone: z.string().optional()
  // Add other optional fields as needed
}).strict();

// Middleware generator
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message).join(', ');
    res.status(400);
    return next(new Error(`Validation error: ${errors}`));
  }
  // Use parsed/coerced data
  req.body = result.data;
  next();
};
