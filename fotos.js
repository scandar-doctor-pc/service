(function () {
  var extensiones = ["jpg", "jpeg", "webp"];
  var imagenes = document.querySelectorAll("img[data-foto]");

  for (var n = 0; n < imagenes.length; n++) {
    (function (img) {
      var base = img.getAttribute("data-foto");
      var i = 0;
      function probar() {
        if (i >= extensiones.length) return;
        var url = base + "." + extensiones[i];
        var prueba = new Image();
        prueba.onload = function () { img.src = url; };
        prueba.onerror = function () { i++; probar(); };
        prueba.src = url;
      }
      probar();
    })(imagenes[n]);
  }
})();