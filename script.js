function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const API_URL_CART = 'https://api.mercadolibre.com/items/';

const extraiPesquisa = data => data.json();

const buscarNoObj = ({ id, title, price, thumbnail }, fun) => {
  const newObjeto = {
    sku: id,
    name: title,
    salePrice: price,
    image: thumbnail,
  };
  return fun(newObjeto);
};

async function cartItem(id) {
  const ol = document.querySelector('.cart__items');
  try {
    const searchId = await window.fetch(`${API_URL_CART}${id}`);
    const json = await extraiPesquisa(searchId);
    await ol.appendChild(buscarNoObj(json, createCartItemElement));
  } catch (error) {
    console.log('Ixi, deu erro no requisito 2: ', error);
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const produtClick = (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  cartItem(id);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', produtClick);
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

// -----------------------------------------------------
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const search = value => window.fetch(`${API_URL}${value}`);

const addlist = async () => {
  const containerItem = document.querySelector('.items');
  try {
    const searchComputer = await search('computador');
    const json = await extraiPesquisa(searchComputer);
    await json.results.forEach((elementos) => {
      containerItem.appendChild(buscarNoObj(elementos, createProductItemElement));
    });
  } catch (error) {
    console.log('Ixi, deu erro no requisito 1: ', error);
  }
};

window.onload = () => {
  addlist();
  cartItem();
};
