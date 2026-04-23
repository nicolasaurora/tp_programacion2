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







