//matcheo las variables con los campos q tengo en el html
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

const divMensajes = document.getElementById("divMensajes");

const divDatos = document.getElementById("divDatos");
const btnDatos = document.getElementById("btnDatos");

btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    let email = inputEmail.value;
    let password = inputPassword.value;

    if (!email || !password) {
        divMensajes.textContent = "Email y pass son obligatorios";
        setTimeout(() => {
            divMensajes.textContent = ""
        }, 3000)
        return
    }
    //validaciones pertinentes
    let response = await fetch("/api/sessions/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })


    if (response.status >= 400) {
        let { message } = await response.json();

        divMensajes.textContent = "Error al autenticar " + message;
        setTimeout(() => {
            divMensajes.textContent = ""
        }, 3000);
        return
    }
    let data = await response.json();

    //guardo el token en localStorage (o en una cookie, q es mejor porque tiene mas seguridad)
    // localStorage.setItem("token", data.token)
    divMensajes.textContent = `Login exitoso para ${data.user.nombre}`
})

//Pruebas
btnDatos.addEventListener("click", async (e) => {
    e.preventDefault();
    //TODO: verificar si viene el token completo porque si hago logout/ no inicie sesion me viene solo la palabra "bearer" y me da error de token mal formado
    let response = await fetch("/test");
    let data = await response.json();
    /**
     * JSON.stringify() es una función nativa de JavaScript que convierte un objeto de JavaScript en una cadena de texto (string) en formato JSON. Acepta tres parámetros:

        1.º parámetro (data): Es el objeto o dato que deseas convertir a texto (en tu caso, la respuesta recibida del servidor).

        2.º parámetro (null): Es una función reemplazadora (replacer) que sirve para filtrar o transformar propiedades. Al pasar null, le indicas que incluya todas las propiedades sin aplicar ningún filtro.

        3.º parámetro (2): Es el nivel de indentación/espaciado. Al poner un número como 2, en lugar de generar un texto plano en una sola línea comprimida, le da formato legible ("pretty-print") agregando saltos de línea y 2 espacios de sangría por cada nivel del objeto.
     */
    divDatos.textContent = JSON.stringify(data, null, 2);
})