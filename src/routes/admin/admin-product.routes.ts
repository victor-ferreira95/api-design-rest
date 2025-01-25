import { Router } from "express";
import { createProductService } from "../../services/product.service";
import { Resource, ResourceCollection } from "../../http/resource";

const router = Router();

router.post("/", async (req, res, next) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  try {
    const product = await productService.createProduct(
      name,
      slug,
      description,
      price,
      categoryIds
    );

    res.set("Location", `/admin/products/${product.id}`).status(201)
    const resource = new Resource(product)
    next(resource)
  } catch (e) {
    next(e)
  }
});

router.get("/:productId", async (req, res, next) => {
  const productService = await createProductService();
  const product = await productService.getProductById(
    +req.params.productId
  );

  if (!product) {
    res.status(404).json({
      title: "Not found",
      status: 404,
      detail: `Product with id ${req.params.productId} not found`,
    })
    return
  }

  const resource = new Resource(product)
  next(resource)
});

router.patch("/:productId", async (req, res, next) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  const product = await productService.updateProduct({
    id: +req.params.productId,
    name,
    slug,
    description,
    price,
    categoryIds,
  });


  const resource = new Resource(product)
  next(resource)
});

router.delete("/:productId", async (req, res) => {
  const productService = await createProductService();
  const { productId } = req.params;
  await productService.deleteProduct(+productId);
  res.status(204).send();
});

router.get("/", async (req, res, next) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;
  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];
  const { products, total } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });

  if (!req.headers['accept'] || req.headers['accept'] === 'application/json') {
    const collections = new ResourceCollection(products, {
      paginationData: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    })
    return next(collections)
  }

  if (req.headers['accept'] === 'text/csv') {
    const csv = products
      .map((product) => {
        return `${product.name},${product.slug},${product.description},${product.price}`;
      })
      .join("\n");
    res.set('Content-Type', 'text/csv')
    return res.send(csv);
  }

  return res.status(406).json({
    title: "Not Acceptable",
    status: 406,
    detail: `Not Acceptable request format ${req.headers['Accept']}. Accept application/json or text/csv`,
  });
});

export default router;
