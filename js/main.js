const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day 1
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');


let login = localStorage.getItem('login');

let arrCart = [];

buttonAuth.addEventListener('click', toogleModalAuth );

function toogleModalAuth() {
  modalAuth.classList.toggle('is-open')
  loginInput.style.borderColor = '';
  if(modalAuth.classList.contains('is-open')){
    disablesScroll();
  } else {
    enableScroll();
  }
}  

function authorized(){
  function logOut (){
    login ='';
    localStorage.removeItem('login')
    buttonAuth.style.display = '';
    userName.style.display = '';
    cartButton.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut)
    chechAuth();
  }
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'block';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut)
  
};

function notAuthorized(){ 
    
  function logIn(event){
    event.preventDefault();
    if (validName(loginInput.value)){
    login = loginInput.value;
    localStorage.setItem('login',login)
    toogleModalAuth();
    buttonAuth.removeEventListener('click', toogleModalAuth )
    closeAuth.removeEventListener('click', toogleModalAuth )
    loginForm.removeEventListener('submit', logIn )
    loginForm.reset();
    chechAuth();
    } else {
      loginInput.style.borderColor = 'red';
      loginInput.value ='';
    }

  }
  buttonAuth.addEventListener('click', toogleModalAuth )
  closeAuth.addEventListener('click', toogleModalAuth )
  loginForm.addEventListener('submit', logIn )
  modalAuth.addEventListener('click', function(event){
    let target = event.target;
    if(target.classList.contains('modal-auth')){
      toogleModalAuth()
    }
  })
};


function chechAuth() {
  if (login){
    authorized()
  } else {
    notAuthorized()
  }
}
chechAuth();


// day 2

const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const sectioHeading = document.querySelector('.section-head');
const modalBody = document.querySelector('.modal-body');
const modalPriceTag = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

function createCardRestaurant (restaurant){
  const { 
    name,
    image,
    kitchen,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery
  } = restaurant


  const card = `
  <a class="card card-restaurant" data-products='${products}'>
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card)
}


cardsRestaurants.addEventListener('click', openGoods)

function openGoods (event){
  const target = event.target;
  if(login){
    const reustarant = target.closest('.card-restaurant');
    if(reustarant){
      
      // console.log(reustarant.dataset.products)
      // console.log(reustarant.getAttribute('data-products'))
      // console.log(reustarant)
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      cardsMenu.textContent = '';
        getData(`./db/${reustarant.dataset.products}`).then((data)=>{
          data.forEach(createCardGood)
        })

        getData(`./db/partners.json`).then((data)=>{
          for(let i = 0; i<data.length; i++){
            if (data[i].products === reustarant.dataset.products){
              createHeadCardGood(data[i])
            }
          }
        })

    }
  } else {
    toogleModalAuth();
  }

}

function createCardGood(goods){

const { 
  id,
  name,
  description,
  price,
  image
 } = goods;

//
 
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;
  card.innerHTML = `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `
  cardsMenu.insertAdjacentElement('beforeend', card)
}

logo.addEventListener('click', function(){
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
})

// day 3
//slider
new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'cube',
  cubeEffect:{
    shadow:false
  },
  grabCursor: true,
  pagination:{
    el: '.swiper-pagination',
    clickable: true
  },
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev'
  // }

})

//validation
function validName(str){
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str)
}
console.log(validName('Max'))

//day 3
let getData = async function (url) {
const response = await fetch(url)
if(!response.ok){
  throw new Error(`ошибка по адресу ${url}, статус ошибки ${response.status}`)
}

return await response.json()
};



function init(){
  getData('./db/partners.json').then((data)=>{
  data.forEach(createCardRestaurant)
})
}

init();

//dz
// вызов на 161 строке
function createHeadCardGood ({ name,stars,price,kitchen }) {
  sectioHeading.innerHTML = `
          <h2 class="section-title restaurant-title">${name}</h2>
					<div class="card-info">
						<div class="rating">
            ${stars}
						</div>
						<div class="price">От ${price} ₽</div>
						<div class="category">${kitchen}</div>
					</div>
  `
}
const inputSearch =  document.querySelector('.input-search ');
inputSearch.addEventListener('keypress', function(event){
  if(event.charCode === 13){
    let value = event.target.value;
    getData('./db/partners.json').then((data)=>{
    return data.map((partner)=>{
      return partner.products
    });
    })
    .then((linksProduct)=>{
      linksProduct.forEach((link)=>{
        getData(`./db/${link}`)
        .then((data)=>{
          const resultSearch = data.filter((item)=>{
            const nameItem = value.toLowerCase()
            return item.name.toLowerCase().includes(nameItem)
          })
          cardsMenu.textContent = ''; 
          containerPromo.classList.add('hide')
          restaurants.classList.add('hide')
          menu.classList.remove('hide')
          resultSearch.forEach(createCardGood)
        })
      })
    })
  }
})

///day 4
cardsMenu.addEventListener('click', addToCart)

function addToCart(event) {
const target = event.target;
const btnAddToCart = target.closest('.button-add-cart')

if (btnAddToCart){
  const card = target.closest('.card');
  const title = card.querySelector('.card-title-reg').textContent;
  const cost = card.querySelector('.card-price').textContent;
  const id = card.id;
  const food = arrCart.find((item)=>{
    return item.id === id;
  })
  if(food) {
    food.count += 1;
  } else {
    arrCart.push({
    id: id,
    title: title,
    cost: cost,
    count: 1
  })
  }

  localStorage.setItem('arrCart', JSON.stringify(arrCart))
}
}

cartButton.addEventListener('click', function(){
  renderCart();

})
function renderCart(){
  modalBody.textContent = '';
  arrCart = JSON.parse(localStorage.getItem('arrCart'));
  arrCart.forEach((item) => {
    const itemCart = `
        <div class="food-row">
					<span class="food-name">${item.title}</span>
					<strong class="food-price">${item.cost}</strong>
					<div class="food-counter">

						<button class="counter-button counter-button-minus" data-id=${item.id}>-</button>
						<span class="counter">${item.count}</span>
						<button class="counter-button counter-button-plus" data-id=${item.id}>+</button>
					</div>
				</div>
    `
modalBody.insertAdjacentHTML('beforeend', itemCart)
  })
const totalPrice = arrCart.reduce((res,item)=>{
  return res + (parseFloat(item.cost)*item.count);
},0)
console.log(modalPriceTag)
modalPriceTag.textContent = totalPrice;
} 
modalBody.addEventListener('click', changeCount )
function changeCount (event) {
  const target = event.target

  if(target.classList.contains('counter-button')){
    const food = arrCart.find(function(item){
      return item.id === target.dataset.id
    });
  if (target.closest('.counter-button-minus')){
    food.count --;
    if(food.count === 0){
      arrCart.splice(arrCart.indexOf(food),1)
    }

    localStorage.removeItem(arrCart)
    localStorage.setItem('arrCart', JSON.stringify(arrCart))
    }
  if (target.closest('.counter-button-plus')){
    food.count ++;
    localStorage.removeItem(arrCart)
    localStorage.setItem('arrCart', JSON.stringify(arrCart))
    }
    renderCart()
  }
}
buttonClearCart.addEventListener('click', function(){
  arrCart.length = 0;
  localStorage.removeItem(arrCart)
  localStorage.setItem('arrCart', JSON.stringify(arrCart))
  renderCart();
})