import { Router } from 'express';
import { createCategoryService } from '../services/category.service';
import cors from 'cors';
import { defaultCorsOptions } from '../http/cors';
import { responseCached } from '../http/response-cached';

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

// eTag = entity tag
// O eTag é um identificador único usado para validar a cache de recursos HTTP, permitindo verificar se um recurso foi modificado.
router.get('/', corsCollections, async (req, res) => {
  const categoryService = await createCategoryService();
  const { page = 1, limit = 10, name } = req.query;
  const { categories, total } = await categoryService.listCategories({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: { name: name as string }
  });

  return responseCached(
    { res, body: { categories, total } },
    {
      maxAge: 30,
      type: "public",
      revalidate: "must-revalidate",
    }
  )

  // Cache-Control: no-cache, no-store, must-revalidate
  // Pragma: no-cache
  // Expires: 0
  // no-cache: me de os dados atualizado 
  // no-store: não armazene em cache
  // proxy-revalidate: revalidar o cache no nginx
  // must-revalidate: revalidar o cache no cliente e nginx quando expirar
  // if-none-match: eTag do recurso que está no cache
});

router.options("/:categorySlug", corsItem);
router.options("/", corsCollections);


export default router;