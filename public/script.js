var carousel = document.querySelector('.img-car');
var img = document.querySelector('.img-car img');
var imgCar = document.querySelector('.img-car');

setInterval(function(){
    img.style.opacity = '0.7';
    var hrefs =[ '/images/image_carousel/toy.jpg',
                 '/images/image_carousel/apples.jpg',
                 '/images/image_carousel/tshirt.jpg'
                ];
    
        
        var getAttr = img.getAttribute('src');
        if(getAttr == hrefs[0])
            img.setAttribute('src','/images/image_carousel/apples.jpg');
        else if(getAttr == hrefs[1])
            img.setAttribute('src','/images/image_carousel/tshirt.jpg');
        else
            img.setAttribute('src','/images/image_carousel/toy.jpg')
            // imgOpacity();
        },5000);


var search = document.getElementById('search');
var myForm = document.getElementById('myForm');
var card = document.querySelectorAll('.card');

function visible(){
    imgCar.style.display = 'block'
}
const getResult = (e) =>{
    e.preventDefault();
    card.forEach(cards=>{   
        var cardTitle = cards.querySelector('.card-title').innerText.toLowerCase();
        if(cardTitle.indexOf(search.value.toLowerCase())>-1){
            cards.style.display="block"
        }else{
            cards.style.display="none";
            imgCar.style.display='none';
        }
    })
    if(search.value == "")
    visible();
}

myForm.onsubmit = getResult;
search.onkeyup = getResult;