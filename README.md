# Back Office de Ecommerce

_Back office permite configurar y administrar una tienda digital de la plataforma de ecommerce de Insight Up_

## Comenzando
_Frontend:_
_El proyecto fue creado con React[https://reactjs.org/] y Create-react-app[https://create-react-app.dev/], sus componentes estan definidos con functional component y hacen uso de multiples Hooks. Para el estado principal de la aplicación se hace uso de Redux[https://es.redux.js.org/] y para el manejo de rutas React-Router[https://reactrouter.com/web/guides/quick-start]. Para el diseño y estilo de los componentes se utilizo Material IU [https://material-ui.com/]_

_Api Backend:_
_Fue diseñada en Python y Django. Se encuentra desplegada sobre un contenedor Docker_

### Pre-requisitos

_Para un funcionamiento correcto de la aplicación es necesario disponer de la API backend. Solicitar imágen Docker al administrador del proyecto._

### Instalación
_Instrucciones para clonar el proyecto y ejecutarlo en tu máquina local con fines de desarrollo y pruebas._

seleccionar el branch **Develop**
```
git clone ssh
```

_Para instalar el entorno de desarrollo siga los siguientes pasos:_
_Instalar las dependencias del proyecto desde NODEJS_

```
npm install
```
_VARIABLES DE ENTORNO:_
_crear un file .env en el root del repositorio con el endpoint de la API_

```
REACT_APP_API_ENDPOINT_BASE = http://localhost:8080/api/v1/
```

## Ejecutar ⚙️

_Iniciar el servidor local Docker_
_Iniciar el servidor local desde consola de NODEJS_

```
npm run start-pc
```
_En caso de errores y explote todo por las nubes, solicitar ayuda al administrador_