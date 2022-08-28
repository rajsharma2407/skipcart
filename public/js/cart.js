function addCart(id) {
  // alert(id)
  // let poss = false;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/add-to-cart");
  xhr.onreadystatechange = function () {
    // console.log(xhr.readyState);
    if (xhr.readyState === 4) {
      console.log('done')
      quickShow();
    }
  };
  xhr.setRequestHeader("Content-type", "application/json");
  //   console.log(JSON.stringify(id));
 xhr.send(JSON.stringify({ id }));
//  let x = 0;
//  const reload = () =>{
//    if(x == 2)
//    clearInterval(myInterval)
//    location.reload();
//    x++;
//   } 
//   const myInterval = setInterval(reload, 250);

}
var msg = document.getElementById("msg");
function quickShow() {
  msg.style.transform = "translateY(140%)";
  setTimeout(function () {
    msg.style.transform = "translateY(-100%)";
  }, 2000);
}
