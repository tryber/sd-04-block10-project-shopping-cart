/* eslint-disable object-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable arrow-parens */
const mainSection = document.querySelector('.items');
const cartSection = document.querySelector('.cart__items');
const priceSpan = document.querySelector('.total-price');
const emptyButton = document.querySelector('.empty-cart');

// converting .json.results to an array of obj = [...{sku, image, name, salePrice}]:
const productInfo = (products) =>
  products.map(({ id, title, thumbnail, price }) => {
    const obj = {
      sku: id,
      name: title,
      image: thumbnail,
      salePrice: price,
    };
    return obj;
  });

// creating thumbnail element:
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

// creating elements for each item in the main section:
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// creating elements for each item in the cart section:
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  return li;
}

// summing prices asynchronously for each items each time we do a fetch:
const sumCart = async () => {
  const storageArr = await JSON.parse(localStorage.getItem('items'));
  // getting the price from local storage string:
  const pricesArr = await storageArr.map(item => Number(item.split('PRICE: $')[1]));
  const sum = await pricesArr.reduce((total, num) => total + num, 0);
  priceSpan.innerHTML = sum.toFixed(2).replace(/\.00$/, '');
};

let arrLStorage = [];
// adding empty car functionality:
const emptyCart = () => {
  arrLStorage = [];
  localStorage.clear();
  sumCart();
  while (cartSection.firstChild) {
    cartSection.firstChild.remove();
  }
};
emptyButton.addEventListener('click', emptyCart);

// adding to localStorage, this function is called each time we do a fetch:
const addingToStorage = (product) => {
  if (localStorage.getItem('items') != null) {
    arrLStorage = JSON.parse(localStorage.getItem('items'));
    arrLStorage.push(product.innerHTML);
    localStorage.setItem('items', JSON.stringify(arrLStorage));
  } else {
    arrLStorage.push(product.innerHTML);
    localStorage.setItem('items', JSON.stringify(arrLStorage));
  }
};

// removing the item from localStorage, this function is called each time we remove an item:
const removingFromStorage = (item) => {
  arrLStorage = JSON.parse(localStorage.getItem('items'));
  // removing the product from the storage array:
  const i = arrLStorage.indexOf(item.innerHTML);
  arrLStorage.splice(i, 1);
  // then setting the new array as the current storage:
  localStorage.setItem('items', JSON.stringify(arrLStorage));
};

// removing itens from the cart by clicking on them:
function cartItemClickListener(event) {
  // removing element only if it's a list:
  if (event.target && event.target.nodeName === 'LI') {
    event.target.parentNode.removeChild(event.target);
    removingFromStorage(event.target);
  }
  sumCart(); // updating the total, after removing items from the cart
}
cartSection.addEventListener('click', cartItemClickListener);

// loading localStorage when the page loads:
const loadingLS = () => {
  const dataFromLStorage = JSON.parse(localStorage.getItem('items'));
  dataFromLStorage.forEach(elem => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerHTML = elem;
    cartSection.appendChild(li);
  });
};

// adding items to cart by clicking their buttons:
const fetchToCart = async (event) => {
  if (event.target.classList.contains('item__add')) {
    const itemID = event.target.parentNode.firstChild.innerText;
    const fetchCart = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const data = await fetchCart.json();
    const liElem = cartSection.appendChild(createCartItemElement(data));
    addingToStorage(liElem);
    await sumCart();
  }
};
mainSection.addEventListener('click', fetchToCart);

// loading local storage, only if it's not empty:
if (localStorage.getItem('items') != null) {
  loadingLS();
  sumCart();
}

// fetching products informations to the main section:
const fetchToSection = async () => {
  const queryInput = await document.querySelector('.query-input').value;
  const fetchSection = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryInput}`);
  const dataJson = await fetchSection.json();
  const products = await productInfo(dataJson.results).forEach((product) => {
    mainSection.appendChild(createProductItemElement(product));
  });
  return products;
};

// calling fetchToSection and removing loading status:
window.onload = function onload() {
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 500);
  fetchToSection();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
