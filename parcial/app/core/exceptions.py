from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError


def register_exception_handlers(app: FastAPI) -> None:
    """
    Registra manejadores globales de excepciones para cumplir con RN-15:
    - Ningún error devuelve texto interno de la base ni mapa de esquema.
    - Traduce IntegrityError a HTTP 409 o 422 con mensaje legible y seguro.
    - Ninguna entrada inválida termina en un 500.
    """

    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
        error_msg = str(exc.orig).lower() if exc.orig else str(exc).lower()

        # Conflicto de unicidad
        if "unique" in error_msg or "duplicate key" in error_msg or "ix_" in error_msg:
            if "isbn" in error_msg:
                detail = "Ya existe un libro vigente con ese ISBN."
            elif "email" in error_msg:
                detail = "El correo electrónico ya se encuentra registrado."
            elif "nombre" in error_msg:
                detail = "Ya existe un registro con ese nombre."
            elif "asignacion_rol" in error_msg:
                detail = "El usuario ya tiene una asignación activa para ese rol."
            elif "usuario_id" in error_msg:
                detail = "Ese usuario ya está asociado a otro registro."
            else:
                detail = "El recurso que intenta guardar entra en conflicto con un registro existente."
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"detail": detail},
            )

        # Clave foránea inexistente
        if "foreign key" in error_msg or "fk_" in error_msg:
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"detail": "Uno de los recursos relacionados indicados no existe."},
            )

        # Check constraint violation
        if "check constraint" in error_msg or "ck_" in error_msg:
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content={"detail": "Los valores no cumplen con las restricciones de validación requeridas."},
            )

        # Mensaje por defecto sin filtrar SQL
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": "Conflicto de integridad en los datos enviados."},
        )
