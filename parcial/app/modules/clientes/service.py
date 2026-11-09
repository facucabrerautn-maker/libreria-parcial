from fastapi import HTTPException, status
from sqlalchemy import select
from app.modules.clientes.models import Cliente, PerfilCliente
from app.modules.clientes.schemas import (
    ClienteCreate,
    ClienteResponse,
    ClienteUpdate,
    PerfilClienteCreate,
    PerfilClienteResponse,
)
from app.modules.clientes.unit_of_work import ClienteUnitOfWork
from app.modules.ventas.models import Venta


class ClienteService:
    @staticmethod
    async def crear(uow: ClienteUnitOfWork, data: ClienteCreate) -> ClienteResponse:
        async with uow:
            existente = await uow.clientes.get_by_email(data.email)
            if existente:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="El correo electrónico ya se encuentra registrado.",
                )

            nuevo = Cliente(
                nombre=data.nombre.strip(),
                email=data.email.strip().lower(),
            )
            await uow.clientes.add(nuevo)
            return ClienteResponse.model_validate(nuevo)

    @staticmethod
    async def obtener_por_id(uow: ClienteUnitOfWork, id: int) -> ClienteResponse:
        async with uow:
            cliente = await uow.clientes.get_by_id_with_perfil(id)
            if not cliente:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cliente no encontrado",
                )
            return ClienteResponse.model_validate(cliente)

    @staticmethod
    async def actualizar(uow: ClienteUnitOfWork, id: int, data: ClienteUpdate) -> ClienteResponse:
        async with uow:
            cliente = await uow.clientes.get_by_id_with_perfil(id)
            if not cliente:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cliente no encontrado",
                )

            campos = data.model_dump(exclude_unset=True)
            if "email" in campos and campos["email"] is not None:
                nuevo_email = str(campos["email"]).strip().lower()
                if nuevo_email != cliente.email:
                    existente = await uow.clientes.get_by_email(nuevo_email)
                    if existente:
                        raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail="El correo electrónico ya se encuentra registrado.",
                        )
                campos["email"] = nuevo_email

            for k, v in campos.items():
                setattr(cliente, k, v)

            await uow.clientes.update(cliente)
            return ClienteResponse.model_validate(cliente)

    @staticmethod
    async def crear_perfil(
        uow: ClienteUnitOfWork,
        id: int,
        data: PerfilClienteCreate,
    ) -> PerfilClienteResponse:
        async with uow:
            cliente = await uow.clientes.get_by_id(id)
            if not cliente:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cliente no encontrado",
                )

            perfil_existente = await uow.perfiles.get_by_cliente_id(id)
            if perfil_existente:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="El cliente ya posee un perfil asociado.",
                )

            nuevo_perfil = PerfilCliente(
                cliente_id=id,
                telefono=data.telefono.strip(),
                direccion=data.direccion.strip(),
            )
            await uow.perfiles.add(nuevo_perfil)
            return PerfilClienteResponse.model_validate(nuevo_perfil)

    @staticmethod
    async def obtener_ventas(uow: ClienteUnitOfWork, id: int) -> list[dict]:
        async with uow:
            cliente = await uow.clientes.get_by_id(id)
            if not cliente:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cliente no encontrado",
                )

            stmt = select(Venta).where(Venta.cliente_id == id).order_by(Venta.fecha.desc())
            result = await uow.session.execute(stmt)
            ventas = result.scalars().all()
            return [
                {
                    "id": v.id,
                    "fecha": v.fecha.isoformat(),
                    "total": str(v.total),
                    "cliente_id": v.cliente_id,
                }
                for v in ventas
            ]
