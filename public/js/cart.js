function addCart(id) {
  // alert(id)
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/add-to-cart");
  xhr.onreadystatechange = function () {
    console.log(xhr.readyState);
    if (xhr.readyState === 4) {
      quickShow();
    }
  };
  xhr.setRequestHeader("Content-type", "application/json");
  //   console.log(JSON.stringify(id));
  xhr.send(JSON.stringify({ id }));
}
var msg = document.getElementById("msg");
function quickShow() {
  msg.style.transform = "translateY(100%)";
  setTimeout(function () {
    msg.style.transform = "translateY(-100%)";
  }, 2000);
}
