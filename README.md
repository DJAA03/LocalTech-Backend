# 🚀 LocalTech - Backend (API)

 Estas son las instrucciones para correr el servidor (backend) de LocalTech. Esta es la API que se encarga de toda la lógica, 
 la conexión con la base de datos y las funciones de IA.

---

### ### ✅ Requisitos Previos

Para poder levantar el backend, se necesita:

* **Node.js**: Versión 18 o superior.
* **npm** o **yarn**.
* Una cuenta de **MongoDB Atlas** o una conexion con **MongoDB Compas**

---

### ### ⚙️ Instalación

En la terminal:

1.  **Navega a la carpeta del backend**:
    
    cd localtech-backend
  
2.  **Instala las dependencias del servidor**:
  
    npm install
   

---

### ### 🔑 Configuración de Variables de Entorno

1.  Dentro de la carpeta `localtech-backend`, crea un archivo llamado `.env`.
2.  Copia y pega esto. **El único valor que debes cambiar es `MONGO_URI`**:

   
    # Puerto para el servidor
    PORT=5000

    # ¡IMPORTANTE! Pega aquí la cadena de conexión de tu base de datos en MongoDB Atlas
    MONGO_URI=mongodb+srv://proyectolocal03_db_user:vRpToimG2NyLVlt0@localtech.8mnxrzo.mongodb.net/?retryWrites=true&w=majority&appName=LocalTech

    # Clave secreta para firmar los tokens de sesión
    JWT_SECRET=ESTA-ES-UNA-CLAVE-SECRETA-PARA-LOCALTECH

    # Código secreto para registrar nuevos administradores
    ADMIN_SECRET_CODE=LOCALTECH_SECRETO_2025

    # Tu clave de API de Google para las funciones de IA (Gemini)
    GOOGLE_API_KEY=AIzaSyD5jDS3VpMpfinEvdxdDUEmse8VNNoHqfo
    

3.  **¡Presta atención!**
    * **`MONGO_URI`**: Este es el **único valor que debes reemplazar**. Si se quiere probar en otra conexión de base de datos de Mongo
    * El resto de las claves (`JWT_SECRET`, `ADMIN_SECRET_CODE`, `GOOGLE_API_KEY`) ya están configuradas como las tenías, así que no necesitas tocarlas.

---

### ### ▶️ Cómo Ejecutar el Servidor

Una vez configurado el `.env`, levanta el servidor con este comando:

npm run dev


* *(Nota: Este comando asume que se tiene un script "dev" en el `package.json` que ejecuta el servidor con `ts-node-dev` o algo similar, como `ts-node-dev src/server.ts`)*

Si todo sale bien, se debería de ver en la terminal dos mensajes clave:

```
✅ Conectado a la base de datos MongoDB
🚀 Servidor corriendo en http://localhost:5000
```
 La API estaría lista para recibir peticiones del frontend. 