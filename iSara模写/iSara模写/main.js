//固定ヘッダー分コンテンツをずらす
let header = document.querySelector(".header");
let h = header.clientHeight;
let body = document.querySelector("body");
body.style.marginTop = h + "px";
