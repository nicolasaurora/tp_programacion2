document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form')
    const datos_guardados = localStorage.getItem('formulario') || ""
    const inputs = document.querySelectorAll('input, select')
    const datos = {}

    if (datos_guardados) {
        const datos_cargar = JSON.parse(datos_guardados)

        for (const clave in datos_cargar) {
            const campo = form.elements[clave]
            campo.value = datos_cargar[clave]

        }
    }

    form.addEventListener('submit', function(e){
        e.preventDefault()
        inputs.forEach(input => {
            if ((input.type === 'radio') && !input.checked) {
                return
            }
            datos[input.name] = input.value
        })
        localStorage.setItem('formulario', JSON.stringify(datos))
    })


    const btn_reset = document.querySelector("#reset")

    btn_reset.addEventListener('click', function(e){
        localStorage.removeItem('formulario')

        inputs.forEach(input => {
            if (input.type === 'radio') {
                input.checked = false
            }
            else {
                input.value = ''
            }
        })
    })
})


// Logica juego:

const cards = document.querySelectorAll(".card");
const contenedor = document.querySelector(".grid");

const arrayCards = Array.from(cards);
const arrayDesordenado = arrayCards.sort(() => Math.random() - 0.5);
const reloj = document.querySelector('#cronometro')
const contadorMovimientos = document.querySelector('#contador')
const arrayRanking = JSON.parse(localStorage.getItem('ranking')) || []


arrayDesordenado.forEach(card => contenedor.appendChild(card));

let primeraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let timer = null
let juegoCompletado = false
let juegoFallido = false
let movimientos = 0
let contadorSegundos = 0


cards.forEach(card => {

    card.addEventListener("click", () => {

        if (timer === null)
        {
            timer = setInterval(actualizarReloj, 1000)
        }

        if (bloqueado) return;
        if (card === primeraCarta) return;
        if (card.classList.contains('flip')) return;

        card.classList.add("flip");

        if (!primeraCarta) {
            primeraCarta = card;
        } else {
            segundaCarta = card;
            bloqueado = true;

            const img1 = primeraCarta.querySelector("img").src;
            const img2 = segundaCarta.querySelector("img").src;

            movimientos++
            actualizarContador()



            if (img1 === img2) {
                resetear();
                verificarVictoria();
            } else {
                setTimeout(() => {
                    primeraCarta.classList.remove("flip");
                    segundaCarta.classList.remove("flip");
                    resetear();
                }, 1000);
            }
        }
    });
});

function resetear() {
    primeraCarta = null;
    segundaCarta = null;
    bloqueado = false;
}

function verificarVictoria() {
    const cartasDadasVuelta = document.querySelectorAll(".card.flip");
    if (cartasDadasVuelta.length === cards.length) {
        juegoCompletado = true;
        clearInterval(timer);
        finalizarJuego();
    }
}

let segundos = 0
let minutos = 3

function actualizarReloj(){
    if (segundos === 0)
    {
        if (minutos === 0)
        {
            juegoFallido = true
            clearInterval(timer)
            finalizarJuego()
            return
        }
        else
        {
            minutos--
            segundos = 59
        }
    }

    else
    {
        segundos--
    }

    contadorSegundos++

    const m = String(minutos).padStart(2, "0")
    const s = String(segundos).padStart(2, "0")

    reloj.textContent = `${m}:${s}`
}

let puntaje = 0

function finalizarJuego() {
    if (juegoCompletado) 
    {
        puntaje = 1000 + (180 - contadorSegundos) * 10 - (movimientos * 10)

        const datosForm = JSON.parse(localStorage.getItem('formulario')) || {}

        const nuevoRegistro = {
            apodo: datosForm.apodo || 'NoName',
            puntaje: puntaje,
            tiempo: contadorSegundos
        }

        if (arrayRanking.length < 10)
        {
            arrayRanking.push(nuevoRegistro)
            arrayRanking.sort((a, b) => b.puntaje - a.puntaje)
            localStorage.setItem('ranking', JSON.stringify(arrayRanking))
            mostrarPopup("Felicidades! Tu puntaje se posicionó entre los 10 mejores. Puntaje: ", puntaje)
            
        }

        else if (puntaje > arrayRanking[9].puntaje)
        {
            arrayRanking[9] = nuevoRegistro
            arrayRanking.sort((a, b) => b.puntaje - a.puntaje)
            localStorage.setItem('ranking', JSON.stringify(arrayRanking))
            mostrarPopup("Felicidades! Tu puntaje se posicionó entre los 10 mejores. Puntaje: ", puntaje)

        }
        else
        {
            mostrarPopup("Felicidades! Lograste completar el juego. Sin embargo, no alcanzó para entrar en los mejores. Puntaje: ", puntaje)
            
        }
        resetearJuego()
    } 
    else if (juegoFallido) 
    {
        mostrarPopup("Más suerte la próxima! No pudiste completar el juego en el tiempo límite. Puntaje: ", puntaje)
        resetearJuego()
    }
}

function resetearJuego(){
    clearInterval(timer)
    timer = null
    primeraCarta = null
    segundaCarta = null
    bloqueado = false
    juegoCompletado = false
    juegoFallido = false
    movimientos = 0
    contadorSegundos = 0
    segundos = 0
    minutos = 3
    puntaje = 0

    cards.forEach(card => card.classList.remove("flip"))

    reloj.textContent = "03:00"
    contadorMovimientos.textContent = movimientos

    bloqueado = true

    setTimeout(() => {
        const nuevoOrden = Array.from(cards).sort(() => Math.random() - 0.5)
        nuevoOrden.forEach(card => contenedor.appendChild(card))
        bloqueado = false
    }, 600)
}

function actualizarContador(){
    contadorMovimientos.textContent = movimientos
}

function mostrarPopup(mensaje, puntaje) {
    document.getElementById('popup-mensaje').textContent = mensaje;
    document.getElementById('popup-puntaje').textContent = puntaje;
    document.getElementById('overlay').classList.add('activo');
}

function cerrarPopupDirecto() {
    document.getElementById('overlay').classList.remove('activo');
}

function cerrarPopup(event) {
    if (event.target === document.getElementById('overlay')) {
    cerrarPopupDirecto();
    }
}


// Logica ranking

function mostrarRanking() {
    const arrayRanking = JSON.parse(localStorage.getItem('ranking')) || []
    const tbody = document.querySelector('#ranking-body')

    tbody.innerHTML = ''

    arrayRanking.forEach((registro, indice) => {
        const fila = document.createElement('tr')
        fila.classList.add('posicion_ranking')

        const min = String(Math.floor(registro.tiempo / 60)).padStart(2, '0')
        const seg = String(registro.tiempo % 60).padStart(2, '0')
        const tiempoFormateado = `${min}:${seg}`

        fila.innerHTML = `
            <td class="item_ranking rank">${indice + 1}</td>
            <td class="item_ranking nombre_jugador">${registro.apodo}</td>
            <td class="item_ranking tiempo_jugador">${tiempoFormateado}</td>
            <td class="item_ranking puntaje_jugador">${registro.puntaje}</td>
        `

        tbody.appendChild(fila)
    })
}

document.addEventListener('DOMContentLoaded', mostrarRanking)
