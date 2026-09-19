//matcheo las variables con los campos q tengo en el html
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

const divMensajes = document.getElementById("divMensajes");

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
    divMensajes.textContent = `Login exitoso para ${data.user.nombre}`
})

