
const findProducts = nameProduct => // Faz a comunicação com a API, recebendo por parâmetro o que vai ser consultado
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${nameProduct}`);

const load = () => {
  const divLoad = document.createElement('div');
  divLoad.innerText = 'Carregando...';
  return divLoad;
};

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
  // section.lastElementChild.id = sku;
  // section.lastElementChild.addEventListener('click', )

  return section;
}

function getSkuFromProductItem(item) { //recebe o item clicado
  return item.querySelector('span.item__sku').innerText; //retorna o id
}

function cartItemClickListener(event) {
  // Digite seu código aqui
  // Fazer o deletar função
}

const findProductsCart = idProduct =>
  fetch(`https://api.mercadolibre.com/items/${idProduct}`);

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemCart = (event) => { // Pega evento do click
  findProductsCart(getSkuFromProductItem(event.path[1])) // passando como parametro o id
    .then(response => response.json())
    .then(data => {
      const objectProductSelected = { sku: data.id, name: data.title, salePrice: data.price };
      // createProductItemElement recebe objeto, o mesmo é criado como filho do items
      const itemSelectedCart = document.querySelector('.cart__items');
      //adiciona produto no carrinho
      itemSelectedCart.appendChild(createCartItemElement(objectProductSelected));
    });
};

const Onload = () => { // Arrow function, que retorna todos os items da API do Mercado Livre, como filhos da classe ITEMS
  const items = document.querySelector('.items'); // Pegando a primeira classe que ele encontra .items
  const divLoad = load();
  // Recebe a criação da load, por que vai ser usada, para adicionar e depois excluir após todos os items já serem carregados
  items.appendChild(divLoad); // Adicionando a divLoad, como um filho do items

  items.addEventListener('click', addItemCart); // Pega item clicado, e chama a função

  findProducts('computador') // passando o 'computador' por parametro para a função
    .then(response => response.json()) // primeiro espera a resposta do findProducts
    .then((data) => { //espera vim a resposat do them acima
      if (data.results.length > 0) { // se resposta do then, vem com items
        data.results.forEach((item) => { // pega alguns dados do que veio da api {}
          const objectProduct = { sku: item.id, name: item.title, image: item.thumbnail };
          // createProductItemElement recebe objeto, o mesmo é criado como filho do items
          items.appendChild(createProductItemElement(objectProduct));
        });
        // remove a div load, pois ja foi carregado todos os items
        items.removeChild(divLoad);
      } else {
        items.innerHTML = 'Esta informação veio sem registros!!';
      }
    })
    .catch((err) => {
      items.innerHTML = `Oops! ${err}`;
    });
};

window.onload = function onload() {
  Onload();
};
