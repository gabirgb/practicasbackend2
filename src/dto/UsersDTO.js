export class UsersDTO {
    constructor(user) {
        this.id = user.id;
        this.nombre = user.firstName;
        this.apellido = user.lastName;
        this.casilla = user.email;
        this.rol = user.role;
    }
}