SE NECESITA INSTALAR PREVIAMENTE POSTGRESS EN TU MAQUINA Y CREAR UNA BASE DE DATOS:

https://www.enterprisedb.com/downloads/postgres-postgresql-downloads


INSTRUCCIONES PARA CORRER:

Posicionarse en el folder de backend:

    cd backend

Instalar dependencias:

    npm i

Correr:

    npm run start:dev


Posicionarse en el folder de frontend:

    cd..
    cd frontend

Instalar dependencias:

    npm i

Correr:

    npm run dev


PLANTILLA DE ENV. (incluir en root de backend):

    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=tu_password
    DB_DATABASE=tu_db
    JWT_SECRET=tu_secreto