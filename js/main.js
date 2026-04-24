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

arrayDesordenado.forEach(card => contenedor.appendChild(card));

let primeraCarta = null;
let segundaCarta = null;
let bloqueado = false;

cards.forEach(card => {

    card.addEventListener("click", () => {

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

            if (img1 === img2) {
                resetear();
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





