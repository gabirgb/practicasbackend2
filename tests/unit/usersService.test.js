// tests/unit/usersService.test.js
import { describe, it, expect, vi } from 'vitest';
import { UsersServices } from '../../src/services/usersServices.js';
import { NotFoundError, ConflictError } from '../../src/utils/CustomError.js';

describe('UsersService - Pruebas de errores', () => {

    it('debe lanzar NotFoundError si el usuario no existe por ID', async () => {
        // Mock del DAO
        const mockDAO = { getById: vi.fn().mockResolvedValue(null) };
        const service = new UsersServices(mockDAO);

        // Verificamos que al ejecutar el servicio se lance exactamente la clase NotFoundError
        await expect(service.getUsersById('12345')).rejects.toThrow(NotFoundError);
        await expect(service.getUsersById('12345')).rejects.toThrow('No se encontró al usuario con id 12345');
    });

    it('debe lanzar ConflictError si el email ya está registrado', async () => {
        // 1. Simulamos que el DAO encuentra un usuario existente con ese email
        const mockDAO = {
            getByEmail: vi.fn().mockResolvedValue({ id: '1', email: 'test@mail.com' })
        };
        const service = new UsersServices(mockDAO);

        // 2. Enviamos los datos COMPLETOS del usuario (nombre, apellido, etc.) 
        //    para que supere las validaciones de campos requeridos (BadRequestError)
        const userData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'test@mail.com',
            password: 'password123'
            // Agrega aquí cualquier otro campo que valide tu createUser
        };

        // 3. Ahora sí llegará a la comprobación de duplicados y lanzará ConflictError
        await expect(service.createUser(userData)).rejects.toThrow(ConflictError);
    });
});