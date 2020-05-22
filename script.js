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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  button.addEventListener('click', function () {
    fetch(`https://api.mercadolibre.com/items/${sku}`)

      .then(result => result.json())
      .then((data) => {
        const obj = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        const List = createCartItemElement(obj);
        const Olist = document.querySelector('.cart__items');
        Olist.appendChild(List);
      })
      .catch(error => console.log(error));
  });
  section.appendChild(button);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

const product = (products) => {
  products.forEach((element) => {
    const sku = element.id;
    const name = element.title;
    const image = element.thumbnail;
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement({ sku, name, image }));
  });
};

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')

    .then(object => object.json())
    .then(obj => product(obj.results))
    .catch(error => console.log(error));
};
