import { Router } from "express";
import { createProductService } from "../../services/product.service";
import { Resource, ResourceCollection } from "../../http/resource";
import cors from "cors";
import { defaultCorsOptions } from "../../http/cors";
import { ProductResource, ProductResourceCollection } from "../../http/product-resource";


const router = Router();

const corsCollections = cors({
  ...defaultCorsOptions,
  methods: ['GET', 'POST']
});

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ['GET', 'PATCH', 'DELETE']
});

router.post("/", corsCollections, async (req, res, next) => {
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
    const resource = new ProductResource(product, req)
    next(resource)
  } catch (e) {
    next(e)
  }
});

router.get("/:productId", corsItem, async (req, res, next) => {
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

  const resource = new ProductResource(product, req)
  next(resource)
});

router.patch("/:productId", corsItem, async (req, res, next) => {
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


  const resource = new ProductResource(product!, req)
  next(resource)
});

router.delete("/:productId", corsItem, async (req, res) => {
  const productService = await createProductService();
  const { productId } = req.params;
  await productService.deleteProduct(+productId);
  res.status(204).send();
});

router.get("/", corsCollections, async (req, res, next) => {
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

  if (!req.headers['accept'] || req.headers['accept'] === '*/*' || req.headers['accept'] === 'application/json') {
    const collections = new ProductResourceCollection(products, req, {
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

  // return res.status(406).json({
  //   title: "Not Acceptable",
  //   status: 406,
  //   detail: `Not Acceptable request format ${req.headers['Accept']}. Accept application/json or text/csv`,
  // });
});

router.options("/", corsCollections);
router.options("/:productId", corsItem);

export default router;
