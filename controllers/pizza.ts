import pizzas from '../db/mongo.ts';

const home = ({ response }:{ response: any }) => {
  response.body = {
    success: true,
    message: 'Everythings looking great'
  };
}

//@desc Get all product
//@route GET /api/v1/pizzas

const getPizzas = async ({ response }: { response: any }) => {
  const products = await pizzas.find();

  response.body = {
    success: true,
    data: products,
  };
}

//@desc Get single product
//@route GET /api/v1/pizza/:id

const getPizza = async ({ params, response }: { params: { id: string }; response: any }) => {
  const product = await pizzas.findOne({
    _id: { $oid: params.id}
  });

  if (product) {
    response.body = {
      success: true,
      data: product
    };
  } else {
    response.body = {
      success: false,
      data: null,
      message: 'Resource Not Found'
    }
  }
}

//@desc Add a product
//@route POST /api/v1/products

const addPizza = async ({ response, request }: { response: any; request: any }) => {
  const body = await request.body();

  if(!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      data: null,
      message: 'No data provided'
    }
  } else {
    const pizza = body.value;

    await pizzas.insertOne({
      name: pizza.name,
      topping: pizza.topping,
      base: pizza.base,
      price: pizza.price
    });

    response.status = 201;
    response.body = {
      success: true,
      data: 'Created'
    }
  }
}

//@desc update a product
//@route PUT /api/v1/producst/:id

const updatePizza = async ({ params, response, request }: { params: { id: string }; response: any; request: any}) => {
  const body = await request.body();
  const product = await pizzas.updateOne(
    { _id: { $oid: params.id }},
    {
      $set: {
        price: body.value.price
      }
    }
  );

  if (product.modifiedCount === 1) {
      response.body = {
        success: true,
        data: product
      }
  } else {
    response.body = {
      success: false,
      data: null,
      message: 'Resource Not Found'
    }
  }
}



//@desc delete a product
//@route delete /api/v1/products/:id

const deletePizza = async ({ params, response }: { params: { id: string }; response: any }) => {
  const product = await pizzas.deleteOne({ _id: { $oid: params.id } });

  if (product === 1) {
    response.body = {
      success: true,
      data: null,
      message: 'Data Deleted'
    }
  } else {
    response.status = 404;
    response.body = {
      success: false,
      message: 'Resource Not Found'
    }
  }
}





export { home, getPizzas, getPizza, addPizza, updatePizza, deletePizza };