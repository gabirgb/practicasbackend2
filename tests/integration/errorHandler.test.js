// tests/integration/errorHandler.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { errorHandler } from '../../src/middlewares/errorHandler.js';
import { NotFoundError } from '../../src/utils/CustomError.js';
import { config } from '../../src/config/config.js';

describe('Middleware errorHandler (Integration Test)', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        // Ruta de prueba que simula un error controlado (404)
        app.get('/test-operational-error', (req, res, next) => {
            next(new NotFoundError('Usuario no encontrado'));
        });

        // Ruta de prueba que simula un error no controlado / bug interno (500)
        app.get('/test-server-error', (req, res, next) => {
            next(new Error('Fallo crítico de base de datos'));
        });

        // Enganchamos el middleware de errores
        app.use(errorHandler);
    });

    it('en desarrollo (development) debe responder con stack y detalles de debug', async () => {
        config.general.NODE_ENV = 'development';

        const res = await request(app).get('/test-operational-error');

        expect(res.status).toBe(404);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Usuario no encontrado');
        // Verificamos que devuelva la información de debug en desarrollo
        expect(res.body).toHaveProperty('debug');
        expect(res.body.debug).toHaveProperty('stack');
    });

    it('en producción (production) no debe exponer el stack en errores 500', async () => {
        config.general.NODE_ENV = 'production';

        const res = await request(app).get('/test-server-error');

        expect(res.status).toBe(500);
        expect(res.body.status).toBe('error');
        // Debe mostrar un mensaje genérico para ocultar el error interno
        expect(res.body.message).toBe('Ha ocurrido un error inesperado en el servidor');
        // NO debe exponer el objeto de debug
        expect(res.body).not.toHaveProperty('debug');
    });
});