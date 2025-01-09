# Curso REST

## Exemplo REST meia boca para E-commerce

| Operação                                      | Método HTTP | Path                                           |
|-----------------------------------------------|-------------|------------------------------------------------|
| JWT login                                     | POST        | /jwt/login                                     |
| Session login                                 | POST        | /session/login                                 |
| Session logout                                | POST        | /session/logout                                |
| Create a customer                             | POST        | /customers/createCustomer                      |
| Get a customer by ID                          | GET         | /admin/customers/getCustomerById               |
| List customers with pagination                | GET         | /admin/customers/listCustomers                 |
| Update a customer                             | POST        | /admin/customers/updateCustomer                |
| Delete a customer                             | POST        | /admin/customers/deleteCustomer                |
| Create a category                             | POST        | /admin/categories/createCategory               |
| Get a category by slug                        | GET         | /categories/getCategoryBySlug                  |
| List categories with pagination               | GET         | /categories/listCategories                     |
| List categories in admin with pagination      | GET         | /admin/categories/listCategories               |
| Update a category                             | POST        | /admin/categories/updateCategory               |
| Delete a category                             | POST        | /admin/categories/deleteCategory               |
| Create a product                              | POST        | /admin/products/createProduct                  |
| Get a product by ID                           | GET         | /admin/products/getProductById                 |
| Get a product by slug                         | GET         | /products/getProductBySlug                     |
| Update a product                              | POST        | /admin/products/updateProduct                  |
| Delete a product                              | POST        | /admin/products/deleteProduct                  |
| List products with pagination                 | GET         | /products/listProducts                         |
| List products in admin with pagination        | GET         | /admin/products/listProducts                   |
| Get CSV of products                           | GET         | /admin/products/listProducts.csv               |
| Add an item to the cart                       | POST        | /carts/addItemToCart                           |
| Get a cart by ID                              | GET         | /carts/getCart                                 |
| Remove an item from the cart                  | POST        | /carts/removeItemFromCart                      |
| Clear the cart                                | POST        | /carts/clearCart                               |
| Create an order                               | POST        | /orders/createOrder                            |
| List orders with pagination                   | GET         | /orders/listOrders                             |

# Exemplo do level 1 - resources
## Exemplo REST meia boca para E-commerce
| Operação                                      | Método HTTP | Path                                           |
|-----------------------------------------------|-------------|------------------------------------------------|
| JWT login                                     | POST        | /jwt/login                                     |
| Session login                                 | POST        | /session/login                                 |
| Session logout                                | POST        | /session/logout                                |
| Create a customer                             | POST        | /customers                                     |
| Get a customer by ID                          | GET         | /admin/customers/:customer_id                  |
| List customers with pagination                | GET         | /admin/customers                               |
| Update a customer                             | POST        | /admin/customers/:customer_id                  |
| Delete a customer                             | POST        | /admin/customers/:customer_id/delete           |
| Create a category                             | POST        | /admin/categories                              |
| Get a category by slug                        | GET         | /categories/:category_slug                     |
| List categories with pagination               | GET         | /categories                                    |
| List categories in admin with pagination      | GET         | /admin/categories                              |
| Update a category                             | POST        | /admin/categories/:category_id                 |
| Delete a category                             | POST        | /admin/categories/:category_id/delete          |
| Create a product                              | POST        | /admin/products                                |
| Get a product by ID                           | GET         | /admin/products/:product_id                    |
| Get a product by slug                         | GET         | /products/:product_slug                        |
| Update a product                              | POST        | /admin/products/:product_id                    |
| Delete a product                              | POST        | /admin/products/:product_id/delete             |
| List products with pagination                 | GET         | /products                                      |
| List products in admin with pagination        | GET         | /admin/products                                |
| Get CSV of products                           | GET         | /admin/products.csv                            |
| Add an item to the cart                       | POST        | /cart/items                                    | 
| Get a cart by ID                              | GET         | /cart                                          |
| Remove an item from the cart                  | POST        | /carts/items/:cart_item_id                     |
| Clear the cart                                | POST        | /carts/clear                                   |
| Create an order                               | POST        | /orders                                        |
| List orders with pagination                   | GET         | /orders     