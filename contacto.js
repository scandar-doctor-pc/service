(function () {
  var NUMERO = "+54 9 11 6140-0698";
  var WA_BASE = "https://api.whatsapp.com/send?phone=5491161400698";
  var WA_URL = WA_BASE + "&text=" + encodeURIComponent("Hola Doctor PC, quisiera hacer una consulta");
  var CORREO = "alejandro.scandar85@gmail.com";
  var ASUNTO = "Consulta desde la web SCANDAR / Doctor PC";
  var GMAIL_URL = "https://mail.google.com/mail/?view=cm&fs=1&to=" + CORREO + "&su=" + encodeURIComponent(ASUNTO);
  var MAILTO_URL = "mailto:" + CORREO + "?subject=" + encodeURIComponent(ASUNTO);
  var FORM_URL = "https://formsubmit.co/ajax/" + CORREO;

  var overlay = null;

  function enMarco() {
    try { return window.self !== window.top; } catch (e) { return !!e; }
  }

  function construir() {
    overlay = document.createElement("div");
    overlay.className = "cm-overlay";
    overlay.id = "cm-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "cm-titulo");
    overlay.innerHTML =
      '<div class="cm-modal" id="cm-modal">' +
        '<button type="button" class="cm-close" id="cm-cerrar" aria-label="Cerrar">&times;</button>' +
        '<h3 id="cm-titulo">Contactame</h3>' +
        '<p class="cm-note" id="cm-nota"></p>' +
        '<div class="cm-row">' +
          '<strong>WhatsApp</strong><span>' + NUMERO + '</span>' +
          '<div class="cm-actions">' +
            '<a class="cm-btn cm-wa" id="cm-lnk-wa" href="' + WA_URL + '" target="_blank" rel="noopener">Abrir WhatsApp</a>' +
            '<button type="button" class="cm-btn" data-copy="' + NUMERO + '">Copiar número</button>' +
            '<button type="button" class="cm-btn" data-copy="' + WA_BASE + '">Copiar enlace</button>' +
          '</div>' +
        '</div>' +
        '<div class="cm-row">' +
          '<strong>Correo electrónico</strong><span>' + CORREO + '</span>' +
          '<div class="cm-actions">' +
            '<a class="cm-btn" id="cm-lnk-gmail" href="' + GMAIL_URL + '" target="_blank" rel="noopener">Abrir Gmail</a>' +
            '<a class="cm-btn" id="cm-lnk-mailto" href="' + MAILTO_URL + '">Abrir mi programa de correo</a>' +
            '<button type="button" class="cm-btn" data-copy="' + CORREO + '">Copiar correo</button>' +
          '</div>' +
        '</div>' +
        '<p class="cm-tip">Si "Abrir WhatsApp" o "Abrir Gmail" no responden con el clic, hacé <strong>clic derecho &rarr; Abrir en nueva ventana</strong>. El botón del programa de correo solo anda si tenés uno instalado.</p>' +
        '<form class="cm-form" id="cm-form">' +
          '<h4>O dejame tu mensaje acá</h4>' +
          '<input type="text" id="cm-nombre" placeholder="Tu nombre" required>' +
          '<input type="email" id="cm-email" placeholder="Tu correo (para responderte)" required>' +
          '<textarea id="cm-mensaje" placeholder="Contame qué le pasa a tu equipo" required></textarea>' +
          '<button type="submit" class="cm-btn cm-send">Enviar mensaje</button>' +
          '<p class="cm-estado" id="cm-estado" role="status"></p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) cerrar();
    });
    document.getElementById("cm-cerrar").addEventListener("click", cerrar);
    document.getElementById("cm-form").addEventListener("submit", enviar);
    document.getElementById("cm-form").addEventListener("input", actualizarEnlaces);
  }

  /* Pasa lo escrito en el formulario al cuerpo de WhatsApp, Gmail y correo */
  function actualizarEnlaces() {
    var nombre = document.getElementById("cm-nombre").value;
    var email = document.getElementById("cm-email").value;
    var mensaje = document.getElementById("cm-mensaje").value;
    var hayTexto = nombre || email || mensaje;
    var texto = "Hola, soy " + nombre + (email ? " (" + email + ")" : "") + ". " + mensaje;
    document.getElementById("cm-lnk-wa").href = hayTexto ? WA_BASE + "&text=" + encodeURIComponent(texto) : WA_URL;
    document.getElementById("cm-lnk-gmail").href = hayTexto ? GMAIL_URL + "&body=" + encodeURIComponent(texto) : GMAIL_URL;
    document.getElementById("cm-lnk-mailto").href = hayTexto ? MAILTO_URL + "&body=" + encodeURIComponent(texto) : MAILTO_URL;
  }

  function abrir(modo) {
    if (!overlay) construir();
    var titulo = document.getElementById("cm-titulo");
    var nota = document.getElementById("cm-nota");
    if (modo === "whatsapp") {
      titulo.textContent = "Escribime por WhatsApp";
      nota.textContent = "Tocá \"Abrir WhatsApp\" o copiá el número. También podés dejarme un mensaje abajo.";
    } else {
      titulo.textContent = "Escribime por correo";
      nota.textContent = "Elegí cómo escribirme: Gmail, tu programa de correo, o enviame el mensaje desde acá.";
    }
    document.getElementById("cm-estado").textContent = "";
    overlay.classList.add("open");
  }

  function cerrar() {
    if (overlay) overlay.classList.remove("open");
  }

  function copiar(texto, boton) {
    var original = boton.textContent;
    function listo() {
      boton.textContent = "¡Copiado!";
      setTimeout(function () { boton.textContent = original; }, 1800);
    }
    function alternativa() {
      var campo = document.createElement("textarea");
      campo.value = texto;
      campo.style.position = "fixed";
      campo.style.opacity = "0";
      document.body.appendChild(campo);
      campo.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = !e; }
      document.body.removeChild(campo);
      if (ok) { listo(); } else { window.prompt("Copiá este dato:", texto); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(listo, alternativa);
    } else {
      alternativa();
    }
  }

  function enviar(e) {
    e.preventDefault();
    var estado = document.getElementById("cm-estado");
    estado.textContent = "Enviando...";
    var datos = {
      name: document.getElementById("cm-nombre").value,
      email: document.getElementById("cm-email").value,
      message: document.getElementById("cm-mensaje").value,
      _subject: ASUNTO,
      _template: "table"
    };
    fetch(FORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(function (r) {
        if (!r.ok) throw new Error("error");
        return r.json();
      })
      .then(function () {
        estado.textContent = "¡Mensaje enviado! Te respondo a la brevedad.";
        document.getElementById("cm-form").reset();
      })
      .catch(function () {
        var texto = "Hola, soy " + datos.name + " (" + datos.email + "). " + datos.message;
        var wa = WA_BASE + "&text=" + encodeURIComponent(texto);
        var gm = GMAIL_URL + "&body=" + encodeURIComponent(texto);
        estado.innerHTML = 'No se pudo enviar desde acá. Mandalo por: ' +
          '<a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a> o ' +
          '<a href="' + gm + '" target="_blank" rel="noopener">Gmail</a> (tu mensaje ya va escrito).';
      });
  }

  /* En página normal: deja actuar al navegador y vigila si pasó algo.
     Si la ventana no perdió el foco ni quedó oculta, el clic no abrió nada. */
  function vigilar(modo) {
    var paso = false;
    function marca() { paso = true; }
    window.addEventListener("blur", marca);
    document.addEventListener("visibilitychange", marca);
    setTimeout(function () {
      window.removeEventListener("blur", marca);
      document.removeEventListener("visibilitychange", marca);
      if (!paso) abrir(modo);
    }, 1500);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrar();
  });

  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el.closest) return;

    var botonCopiar = el.closest("[data-copy]");
    if (botonCopiar) {
      copiar(botonCopiar.getAttribute("data-copy"), botonCopiar);
      return;
    }

    var enlace = el.closest("a");
    if (!enlace || enlace.closest("#cm-modal")) return; // los enlaces de la ventana funcionan solos
    var href = enlace.getAttribute("href") || "";
    var modo = null;
    if (href.indexOf("api.whatsapp.com") > -1 || href.indexOf("wa.me") > -1) modo = "whatsapp";
    else if (href.indexOf("mailto:") === 0) modo = "correo";
    if (!modo) return;

    if (enMarco()) {
      e.preventDefault();
      abrir(modo);
    } else {
      vigilar(modo);
    }
  });
})();