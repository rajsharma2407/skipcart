
var imgCar = document.querySelector('.img-car');
var search = document.getElementById("search");
var myForm = document.getElementById("myForm");
var card = document.querySelectorAll(".card");
var nothingDiv = document.querySelector('.nothingDiv');


imgCar.style.transition = "240ms ease-in-out all";
hide();
function show(){
  nothingDiv.style.display = "block";
}
function hide(){
  nothingDiv.style.display = "none";
}

function visible() {
  imgCar.style.transform = "translateY(0%)";
  
  setTimeout( ()=>{
    console.log(search.value)
    imgCar.style.display = "block";
    // imgCar.style.display = "none"
  }, 250)
}
const getResult = (e) => {
  e.preventDefault();
  let poss = false;
  card.forEach((cards, index) => {
    var cardTitle = cards.querySelector(".card-title").innerText.toLowerCase();
    if (cardTitle.indexOf(search.value.toLowerCase()) > -1) {
      cards.style.display = "block";
      poss = true;
    } else {
      cards.style.display = "none";
      imgCar.style.transform = "translateY(-120%)";
    }
  });
  if(poss == false){
    show();
  }else{
    hide();
  }
  if(search.value != ""){
    setTimeout( ()=>{
      console.log(search.value)
      imgCar.style.display = "none"
    }, 250)
  }
  if (search.value == "") visible();
};

myForm.onsubmit = getResult;
search.onkeyup = getResult;
