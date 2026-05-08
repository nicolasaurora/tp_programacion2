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