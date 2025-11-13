# Distribuidor de Tareas Automatizado

Esta aplicación web utiliza la API de Gemini para analizar un archivo PDF, extraer información sobre tareas, y distribuirlas automáticamente a un equipo de responsables según reglas predefinidas.

## Cómo Poner en Marcha y Desplegar el Proyecto

Para desplegar esta aplicación en GitHub Pages, sigue estos pasos.

### Prerrequisitos

-   Tener [Node.js](https://nodejs.org/) (versión 18 o superior) instalado en tu computadora. Esto también instalará `npm`.
-   Un repositorio de GitHub donde subirás el código.

### Paso 1: Configuración Local

1.  **Descarga los archivos:** Asegúrate de tener todos los archivos del proyecto en una carpeta en tu computadora.
2.  **Abre una terminal:** Navega a la carpeta del proyecto en tu terminal.
3.  **Instala las dependencias:** Ejecuta el siguiente comando para instalar todas las herramientas necesarias para el proyecto.
    ```bash
    npm install
    ```
4.  **Crea el archivo de entorno:** Crea un archivo llamado `.env` en la raíz del proyecto. Este archivo es para tu API key y **no debe ser subido a GitHub**. Añade tu clave dentro de este archivo así:
    ```
    VITE_API_KEY=TU_API_KEY_DE_GEMINI_AQUI
    ```
5.  **Inicia el servidor de desarrollo:** Para probar la aplicación localmente, ejecuta:
    ```bash
    npm run dev
    ```
    Abre la URL que aparece en la terminal (generalmente `http://localhost:5173`) en tu navegador.

### Paso 2: Sube tu Código a GitHub

1.  **Inicializa Git:** Si aún no lo has hecho, inicializa un repositorio de Git en la carpeta de tu proyecto.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  **Conecta y sube:** Conecta tu repositorio local con el de GitHub y sube los archivos. Asegúrate de reemplazar `<tu-usuario>` y `<tu-repositorio>`.
    ```bash
    git remote add origin https://github.com/<tu-usuario>/<tu-repositorio>.git
    git branch -M main
    git push -u origin main
    ```
    **Importante:** Asegúrate de que tu archivo `.gitignore` (que se crea con `npm install`) incluya la línea `.env` para no subir tu API key.

### Paso 3: Configura la API Key en GitHub

El despliegue automático necesita acceder a tu API key de forma segura.

1.  Ve a tu repositorio en GitHub y haz clic en **Settings** > **Secrets and variables** > **Actions**.
2.  Haz clic en **New repository secret**.
3.  Nombra el secreto `VITE_API_KEY`.
4.  Pega tu clave de API de Gemini en el campo de valor.
5.  Haz clic en **Add secret**.

### Paso 4: Activa GitHub Pages

El flujo de trabajo que he añadido (`.github/workflows/deploy.yml`) construirá y desplegará tu sitio automáticamente. Solo necesitas activar GitHub Pages.

1.  Ve a tu repositorio en GitHub y haz clic en **Settings** > **Pages**.
2.  En la sección "Build and deployment", bajo "Source", selecciona **GitHub Actions**.

¡Eso es todo! Ahora, cada vez que hagas `git push` a la rama `main`, GitHub Actions se activará, construirá tu proyecto y lo desplegará. Podrás ver la URL de tu sitio en vivo en la misma sección de **Settings > Pages** después de unos minutos.
