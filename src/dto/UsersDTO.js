export class UsersDTO {
    constructor(user) {
        this.nombre = user.firstName;
        this.apellido = user.lastName;
        this.casilla = user.email;
        this.rol = user.role;
    }
}