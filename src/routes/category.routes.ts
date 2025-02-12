import { Router } from 'express';
import { createCategoryService } from '../services/category.service';
import cors from 'cors';
import { defaultCorsOptions } from '../http/cors';

const router = Router();

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ['GET',]
});

const corsCollections = cors({
  ...defaultCorsOptions,
  methods: ['GET',]
});

router.get('/:categorySlug', corsItem, async (req, res) => {
  const categoryService = await createCategoryService();
  const category = await categoryService.getCategoryBySlug(req.params.categorySlug);
  res.json(category);
});

router.get('/', corsCollections, async (req, res) => {
  const categoryService = await createCategoryService();
  const { page = 1, limit = 10, name } = req.query;
  const { categories, total } = await categoryService.listCategories({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: { name: name as string }
  });

  res.set("Cache-Control", "public, max-age=30")
  res.json({ categories, total });
});

router.options("/:categorySlug", corsItem);
router.options("/", corsCollections);


export default router;