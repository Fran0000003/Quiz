
// SELECCIONAMOS LOS BOTONES DEL MENÚ
const botonInformatica = document.getElementById("informatica");
const botonVideojuegos = document.getElementById("videojuegos");
const botonCultura = document.getElementById("cultura");

// SELECCIONAMOS LAS ZONAS DE LA PÁGINA
const zonaMenu = document.querySelector("main");
const zonaQuiz = document.getElementById("zona-quiz");
const zonaResultados = document.getElementById("zona-resultados");

// ZONA DEL RANKING INDEPENDIENTE
const botonVerRankingMenu = document.getElementById("ver-ranking-menu");
const zonaRankingMenu = document.getElementById("zona-ranking-menu");
const listaRankingMenu = document.getElementById("lista-ranking-menu");
const botonVolverMenuRanking = document.getElementById("volver-menu-ranking");

// ELEMENTOS DEL CUESTIONARIO
const elementoPregunta = document.getElementById("pregunta");
const elementoRespuestas = document.getElementById("respuestas");
const contadorPreguntas = document.getElementById("contador-preguntas");
const barraProgreso = document.getElementById("barra-progreso");

// ELEMENTOS DE LAS PISTAS
const botonVerPista = document.getElementById("ver-pista");
const textoPista = document.getElementById("texto-pista");

// BOTONES DEL CUESTIONARIO
const botonConfirmar = document.getElementById("confirmar");
const botonSiguiente = document.getElementById("siguiente");

// ELEMENTOS DE RESULTADOS
const resultadoPuntuacion = document.getElementById("resultado-puntuacion");
const botonVolverMenu = document.getElementById("volver-menu");

// ELEMENTOS DEL RANKING DE RESULTADOS
const nombreJugador = document.getElementById("nombre-jugador");
const botonGuardarPuntuacion = document.getElementById("guardar-puntuacion");
const listaRanking = document.getElementById("lista-ranking");

// VARIABLES DEL CUESTIONARIO
let preguntasActuales = [];
let preguntaActual = 0;
let respuestaSeleccionada = null;
let respuestaCorrecta = null;
let puntuacion = 0;
let nombreCuestionario = "";


// FUNCIÓN PARA MEZCLAR LAS PREGUNTAS
function mezclarPreguntas(preguntas) {

    const preguntasMezcladas = [...preguntas];

    for (let i = preguntasMezcladas.length - 1; i > 0; i--) {

        const posicionAleatoria = Math.floor(Math.random() * (i + 1));

        const temporal = preguntasMezcladas[i];

        preguntasMezcladas[i] = preguntasMezcladas[posicionAleatoria];

        preguntasMezcladas[posicionAleatoria] = temporal;

    }

    return preguntasMezcladas;
}


// FUNCIÓN PARA CARGAR LAS PREGUNTAS
function cargarQuiz(archivo) {

    fetch(archivo)

        .then(function(response) {

            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo JSON.");
            }

            return response.json();

        })

        .then(function(preguntas) {

            if (preguntas.length < 10) {
                throw new Error("El cuestionario necesita al menos 10 preguntas.");
            }

            zonaMenu.hidden = true;
            zonaResultados.hidden = true;
            zonaRankingMenu.hidden = true;
            zonaQuiz.hidden = false;

            const preguntasMezcladas = mezclarPreguntas(preguntas);

            preguntasActuales = preguntasMezcladas.slice(0, 10);

            preguntaActual = 0;
            puntuacion = 0;

            barraProgreso.style.width = "0%";

            console.log("Preguntas seleccionadas:", preguntasActuales);
            console.log("Puntuación inicial:", puntuacion);

            mostrarPregunta();

        })

        .catch(function(error) {

            console.log("Error al cargar las preguntas:", error);

            alert("No se ha podido cargar el cuestionario: " + error.message);

            zonaQuiz.hidden = true;
            zonaResultados.hidden = true;
            zonaRankingMenu.hidden = true;
            zonaMenu.hidden = false;

        });

}


// FUNCIÓN PARA MOSTRAR UNA PREGUNTA
function mostrarPregunta() {

    const pregunta = preguntasActuales[preguntaActual];

    elementoPregunta.textContent = pregunta.pregunta;

    contadorPreguntas.textContent =
        "Pregunta " + (preguntaActual + 1) + " de " + preguntasActuales.length;

    const progreso = ((preguntaActual + 1) / preguntasActuales.length) * 100;

    barraProgreso.style.width = progreso + "%";

    elementoRespuestas.innerHTML = "";

    respuestaSeleccionada = null;
    respuestaCorrecta = pregunta.correcta;

    botonConfirmar.hidden = false;
    botonConfirmar.disabled = false;

    botonSiguiente.hidden = true;

    // REINICIAMOS LA PISTA
    textoPista.textContent = "";
    textoPista.hidden = true;
    botonVerPista.hidden = false;

    // CREAMOS LOS BOTONES DE RESPUESTA
    pregunta.respuestas.forEach(function(respuesta, indice) {

        const boton = document.createElement("button");

        boton.textContent = respuesta;

        boton.addEventListener("click", function() {

            elementoRespuestas.querySelectorAll("button").forEach(function(botonAnterior) {

                botonAnterior.classList.remove("seleccionada");

            });

            boton.classList.add("seleccionada");

            respuestaSeleccionada = indice;

            console.log("Respuesta seleccionada:", respuestaSeleccionada);

        });

        elementoRespuestas.appendChild(boton);

    });

}


// MOSTRAMOS LA PISTA
botonVerPista.addEventListener("click", function() {

    const pregunta = preguntasActuales[preguntaActual];

    textoPista.textContent = pregunta.pista || "No hay ninguna pista disponible.";

    textoPista.hidden = false;

    botonVerPista.hidden = true;

});


// COMPROBAMOS LA RESPUESTA
botonConfirmar.addEventListener("click", function() {

    if (respuestaSeleccionada === null) {

        alert("Selecciona una respuesta primero.");

        return;

    }

    const botonesRespuesta = elementoRespuestas.querySelectorAll("button");

    botonesRespuesta[respuestaCorrecta].classList.add("correcta");

    if (respuestaSeleccionada === respuestaCorrecta) {

        puntuacion++;

        console.log("¡Respuesta correcta! Puntuación:", puntuacion);

    } else {

        botonesRespuesta[respuestaSeleccionada].classList.add("incorrecta");

        console.log("Respuesta incorrecta. Puntuación:", puntuacion);

    }

    botonesRespuesta.forEach(function(boton) {

        boton.disabled = true;

    });

    botonConfirmar.disabled = true;

    botonConfirmar.hidden = true;
    botonSiguiente.hidden = false;

});


// PASAMOS A LA SIGUIENTE PREGUNTA
botonSiguiente.addEventListener("click", function() {

    preguntaActual++;

    if (preguntaActual < preguntasActuales.length) {

        mostrarPregunta();

    } else {

        zonaQuiz.hidden = true;
        zonaResultados.hidden = false;

        const porcentaje = (puntuacion / preguntasActuales.length) * 100;

        resultadoPuntuacion.textContent =
            "Has conseguido " + puntuacion + " de " +
            preguntasActuales.length + " puntos. " +
            "Tu porcentaje de aciertos es del " + porcentaje + "%.";

        nombreJugador.value = "";
        botonGuardarPuntuacion.disabled = false;

        mostrarRanking();

        console.log("Puntuación final:", puntuacion, "/", preguntasActuales.length);
        console.log("Porcentaje de aciertos:", porcentaje + "%");

    }

});


// GUARDAMOS LA PUNTUACIÓN
botonGuardarPuntuacion.addEventListener("click", function() {

    const nombre = nombreJugador.value.trim();

    if (nombre === "") {

        alert("Escribe tu nombre antes de guardar la puntuación.");

        return;

    }

    let ranking = JSON.parse(localStorage.getItem("rankingQuiz")) || [];

    const nuevaPuntuacion = {
        nombre: nombre,
        puntuacion: puntuacion,
        cuestionario: nombreCuestionario
    };

    ranking.push(nuevaPuntuacion);

    ranking.sort(function(a, b) {

        return b.puntuacion - a.puntuacion;

    });

    ranking = ranking.slice(0, 10);

    localStorage.setItem("rankingQuiz", JSON.stringify(ranking));

    mostrarRanking();

    botonGuardarPuntuacion.disabled = true;

    alert("¡Tu puntuación se ha guardado correctamente!");

});


// FUNCIÓN PARA MOSTRAR EL RANKING EN RESULTADOS
function mostrarRanking() {

    const ranking = JSON.parse(localStorage.getItem("rankingQuiz")) || [];

    listaRanking.innerHTML = "";

    if (ranking.length === 0) {

        listaRanking.textContent = "Todavía no hay puntuaciones guardadas.";

        return;

    }

    const lista = document.createElement("ol");

    ranking.forEach(function(jugador, indice) {

        const elemento = document.createElement("li");

        let medalla = "";

        if (indice === 0) {
            medalla = "🥇 ";
        } else if (indice === 1) {
            medalla = "🥈 ";
        } else if (indice === 2) {
            medalla = "🥉 ";
        }

        elemento.textContent =
            medalla +
            jugador.nombre + " - " +
            jugador.puntuacion + "/10 puntos (" +
            jugador.cuestionario + ")";

        lista.appendChild(elemento);

    });

    listaRanking.appendChild(lista);

}


// ABRIR EL RANKING DESDE EL MENÚ
botonVerRankingMenu.addEventListener("click", function() {

    zonaMenu.hidden = true;
    zonaQuiz.hidden = true;
    zonaResultados.hidden = true;

    zonaRankingMenu.hidden = false;

    const ranking = JSON.parse(localStorage.getItem("rankingQuiz")) || [];

    listaRankingMenu.innerHTML = "";

    if (ranking.length === 0) {

        listaRankingMenu.textContent = "Todavía no hay puntuaciones guardadas.";

        return;

    }

    const lista = document.createElement("ol");

    ranking.forEach(function(jugador, indice) {

        const elemento = document.createElement("li");

        let medalla = "";

        if (indice === 0) {
            medalla = "🥇 ";
        } else if (indice === 1) {
            medalla = "🥈 ";
        } else if (indice === 2) {
            medalla = "🥉 ";
        }

        elemento.textContent =
            medalla +
            jugador.nombre + " - " +
            jugador.puntuacion + "/10 puntos (" +
            jugador.cuestionario + ")";

        lista.appendChild(elemento);

    });

    listaRankingMenu.appendChild(lista);

});


// VOLVER AL MENÚ DESDE EL RANKING
botonVolverMenuRanking.addEventListener("click", function() {

    zonaRankingMenu.hidden = true;

    zonaMenu.hidden = false;

});


// VOLVER AL MENÚ DESDE LOS RESULTADOS
botonVolverMenu.addEventListener("click", function() {

    zonaResultados.hidden = true;

    zonaMenu.hidden = false;

});


// BOTONES DE LOS CUESTIONARIOS
botonInformatica.addEventListener("click", function() {

    nombreCuestionario = "Informática";

    cargarQuiz("json/quiz1.json");

});

botonVideojuegos.addEventListener("click", function() {

    nombreCuestionario = "Videojuegos";

    cargarQuiz("json/quiz2.json");

});

botonCultura.addEventListener("click", function() {

    nombreCuestionario = "Cultura general";

    cargarQuiz("json/quiz3.json");

});
