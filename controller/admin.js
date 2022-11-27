const Products = require("../model/product");

const ITEMS_PER_PAGE = 2;

exports.getProducts = async (req, res) => {
  const page = req.query.page;
  const productToSkip = (page - 1) * ITEMS_PER_PAGE;

  try {
    const productCount = await Products.count();

    const response = await Products.findAll({
      offset: productToSkip,
      limit: ITEMS_PER_PAGE,
    });

    const dataToFrontEnd = {
      response,
      paginationData: {
        currentPage: Number(page),
        hasNextPage: ITEMS_PER_PAGE * page < productCount,
        hasPreviousPage: page > 1,
        nextPage: Number(page) + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productCount / ITEMS_PER_PAGE),
      },
    };

    res.json(dataToFrontEnd);
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res) => {
  const prodId = req.params.prodId;

  let fetchedCart;
  let newQuantity = 1;

  try {
    const cart = await req.user.getCart();

    fetchedCart = cart;

    const products = await cart.getProducts({ where: { id: prodId } });

    let product;

    if (products.length > 0) {
      product = products[0];
    }

    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    }

    const product1 = await Products.findByPk(prodId);

    const finalUpdate = await fetchedCart.addProduct(product1, {
      through: { quantity: newQuantity },
    });

    res.json(finalUpdate);
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.json(products);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => console.log(err));
};
