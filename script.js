const getProductsFromLocalStorage = () =>
  JSON.parse(localStorage.getItem('products'));

const sumCartPrices = () =>
  new Promise((resolve, reject) => {
    if (localStorage.products) {
      const sum = getProductsFromLocalStorage().reduce(
        (acc, product) => acc + product.price,
        0,
      );
      resolve(sum);
    }
    reject('deu ruim, não tinha local Storage');
  });

const displaySum = (sum) => {
  const prices = document.querySelector('.total-price');
  return new Promise((resolve, reject) => {
    if (sum) {
      prices.innerText = sum;
      resolve();
    } else {
      reject('Deu ruim não tinha soma dos preços');
      prices.innerText = 'testando';
    }
  });
};

const asyncSum = async () => {
  try {
    const sumCartPricesResponse = await sumCartPrices();
    await displaySum(sumCartPricesResponse);
  } catch (erro) {
    console.log(erro);
  }
};

const clearCart = () => {
  const prices = document.querySelector('.total-price');
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  localStorage.setItem('products', JSON.stringify([]));
  asyncSum();
  prices.innerText = 0.0;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  element = event.target;
  if (element) {
    element.parentNode.removeChild(element);
    const products = JSON.parse(localStorage.getItem('products'));
    if (products) {
      const ProductId = products.findIndex(
        product => product.id === event.target.id,
      );
      const filteredProducts = products
        .slice(0, ProductId)
        .concat(products.slice(ProductId + 1, products.lenght));
      localStorage.setItem('products', JSON.stringify(filteredProducts));
      asyncSum();
    }
  } else {
    console.log('Sem produtos para remover');
  }
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.id = id;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then(object => object.json())
        .then((data) => {
          const cart = document.querySelector('.cart__items');
          cart.appendChild(createCartItemElement(data));

          const products = JSON.parse(localStorage.getItem('products'));
          const { title, price } = data;
          products.push({ id, title, price });
          localStorage.setItem('products', JSON.stringify(products));
        })
        .then(() => asyncSum());
    });
  }
  return e;
}

function createProductItemElement({
  id = 'teste',
  title = 'teste',
  thumbnail = 'teste',
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', id),
  );
  return section;
}

const appendToItems = (data) => {
  const items = document.querySelector('.items');
  data.results.forEach((product) => {
    items.appendChild(createProductItemElement(product));
  });
};

window.onload = () => {
  const cart = document.querySelector('.cart__items');
  const emptyCart = document.querySelector('.empty-cart');
  const loading = document.querySelector('.loading');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(object => object.json())
    .then(data => appendToItems(data))
    .then(asyncSum())
    .catch(erro => console.log(erro));

  // .then(loading.parentNode.removeChild(loading)) retirado para colocar setTimeOut

  if (localStorage.products) {
    const products = JSON.parse(localStorage.getItem('products'));
    products.forEach(product =>
      cart.appendChild(createCartItemElement(product)),
    );
  } else {
    localStorage.setItem('products', JSON.stringify([]));
  }

  emptyCart.addEventListener('click', () => clearCart());

  setTimeout(() => {
    loading.remove();
  }, 2000);
};
