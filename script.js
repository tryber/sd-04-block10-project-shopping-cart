

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const addCart = () => {
  const itemsButtom = document.getElementsByClassName('item__add');
  const cart = document.getElementsByClassName('cart__items')[0];
  for (let i = 0; i < itemsButtom.length; i += 1) {
    itemsButtom[i].addEventListener('click', async (e) => {
      const itemTarget = getSkuFromProductItem(e.target.parentNode);
      const itemApi = await (await fetch(`https://api.mercadolibre.com/items/${itemTarget}`)).json()
      .then(({ id, title, price }) => {
        const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
        // li.addEventListener('click', cartItemClickListener);
        return li;
      });
      console.log(itemApi);
      return cart.appendChild(itemApi);
    });
  }
};
// function cartItemClickListener() {
//   createCartItemElement(addCart());
// }

const fetchAPI = async () => {
  const productsSection = document.querySelector('.items');
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  await console.log(data.results);
  await Object.values(data.results).forEach(({ id, title, thumbnail }) => {
    const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
    productsSection.appendChild(product);
  });
};

window.onload = async () => {
  const fetchAll = async () => {
    await fetchAPI();
    await addCart();
  };
  fetchAll();
};
