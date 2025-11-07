# API-IDEE Community Plugins

Repositorio de plugins comunitarios para la **API IDEE**. Este proyecto contiene plugins desarrollados por la comunidad que extienden las funcionalidades de la API IDEE.

## Descripción

Este repositorio alberga plugins comunitarios que pueden ser utilizados con la API IDEE para añadir funcionalidades adicionales a aplicaciones de mapas web.

## Estructura del Proyecto

```
API-IDEE_CommunityPlugins/
├── configuration/            # Configuración 
│   └── domain.js             # Configuración del dominio de la API-IDEE
├── plugins/                  # Plugins disponibles (source)
│   └── basic/                # Plugin básico (plantilla para crear otros plugins)
│       ├── src/              # Código fuente
│       ├── dist/             # Archivos compilados para producción
│       ├── legacy/           # Histórico de versiones del plugin
│       ├── test/             # Tests y ejemplos
│       └── webpack-config/   # Configuraciones de Webpack
│   └── otros/                # Otros plugins
└── gallery/                  # Galería de ejemplo de los plugins
    └── basic/                # Ejemplo del plugin básico
    └── otros/                # Otros plugins
```

## Guía de uso de plugins en visualizadores

Para hacer uso de los plugins disponibles en API-IDEE Community Plugins incluye los archivos CSS y JS correspondientes al plugin que deseas añadir a tu visualizador:

Ejemplo con el plugin Basic:
```html
<!-- Para implementación OpenLayers -->
<link href="https://componentes.idee.es/api-idee-communityplugins/plugins/basic/dist/basic.ol.min.css" rel="stylesheet" />
<script type="text/javascript" src="https://componentes.idee.es/api-idee-communityplugins/plugins/basic/dist/basic.ol.min.js"></script>

<!-- Para implementación Cesium -->
<link href="https://componentes.idee.es/api-idee-communityplugins/plugins/basic/dist/basic.cesium.min.css" rel="stylesheet" />
<script type="text/javascript" src="https://componentes.idee.es/api-idee-communityplugins/plugins/basic/dist/basic.cesium.min.js"></script>
```

### Ejemplo de Uso

```javascript
// Crear el mapa
const map = IDEE.map({
    container: 'mapjs',
});

// Instanciar el plugin
const mp = new IDEE.plugin.Basic({
    position: 'TR',
    collapsed: true,
    collapsible: true,
    tooltip: 'Plugin básico'
});

// Añadir el plugin al mapa
map.addPlugin(mp);
```


## Versiones

Existe un histórico de versiones de todos los plugins en el directorio `legacy/` de cada plugin. 
Es recomendable fijar las versiones para evitar errores inesperados.

Ejemplo con el plugin Basic, implementación OpenLayers y versión 1.0.0:
```html
<link href="https://componentes.idee.es/api-idee-communityplugins/plugins/basic/legacy/basic-1.0.0.ol.min.css" rel="stylesheet" />
<script type="text/javascript" src="https://componentes.idee.es/api-idee-communityplugins/plugins/basic/legacy/basic-1.0.0.ol.min.js"></script>
```

## Desarrollo

### Requisitos Previos

- **Node.js**: Versión 16 o superior
- **NPM**: Versión 8.19.4 o superior

### Configuración del Entorno de Desarrollo

1. **Clonar el repositorio**

```bash
git clone https://github.com/Desarrollos-IDEE/API-IDEE_CommunityPlugins.git
cd API-IDEE_CommunityPlugins
```

2. **Instalar dependencias del plugin**

Ejemplo con el plugin Basic:
```bash
cd plugins/basic
npm install
```

3. **Iniciar el servidor de desarrollo**

```bash
# Para OpenLayers
npm run start:ol

# Para Cesium
npm run start:cesium
```

### Estructura de un Plugin

Cada plugin debe seguir esta estructura:

```
plugin-name/
├── src/
│   ├── facade/          # Código común 
│   │   ├── js/          # JavaScript del plugin
│   │   ├── assets/      # CSS, imágenes, fuentes
│   │   └── i18n/        # Archivos de internacionalización
│   ├── impl/            # Implementaciones específicas
│   │   ├── ol/          # Implementación para OpenLayers
│   │   └── cesium/      # Implementación para Cesium
│   ├── templates/       # Plantillas HTML
│   ├── api.json         # Metadatos y configuración del plugin
├── dist/                # Archivos última versión compilados
├── legacy/              # Histórico de versiones
├── test/                # Tests
└── webpack-config/      # Configuraciones de Webpack
```

### Testing

Cada plugin incluye archivos de prueba en el directorio `test/`:

- `dev.html` - Para pruebas en desarrollo
- `prod.html` - Para pruebas con el plugin compilado


### Contribución

Las contribuciones son bienvenidas. Para contribuir:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nuevo-plugin`)
3. Desarrolla tu plugin siguiendo la estructura establecida
   > 3.1. Copia la estructura del plugin `basic` como plantilla o usa la herramienta de npm [api-idee-create-plugin](https://www.npmjs.com/package/api-idee-create-plugin)  
   > 3.2. Modifica los archivos según tus necesidades  
   > 3.3. Desarrolla las implementaciones para OpenLayers y/o Cesium
4. Compila y prueba tu plugin
5. Desarrolla un test funcional en la galería (Puedes usar como plantilla el de basic)
6. Envía un Pull Request


<a id="normas-pull-request"></a>Para que un Pull Request sea aceptado se deben cumplir las siguientes normas:
1. Disponer del directorio legacy en su raíz
2. Tener documentado correctamente el fichero api.json y README.md
3. Disponer de la implementación en OpenLayers y en Cesium JS.
Nota: no es necesario el desarrollo de la implementación pero si de la estructura básica.
4. Compilar correctamente
5. Disponer de al menos 1 test en la galería, este test debe ser interactivo permitiendo visualizar todos los parámetros disponibles e interactuar con ellos


#### Migración

¿Tienes un plugin ya desarrollado y quieres añadirlo a nuestro repositorio? ¡También eres bienvenido!
Sigue esta guía para poder contribuir:
1. Comprueba que en el fichero package.json dispones en el apartado "scripts", al menos, el siguiente contenido:
```
    "start": "webpack serve --config=webpack-config/webpack.development-ol.config.js",
    "start:ol": "webpack serve --config=webpack-config/webpack.development-ol.config.js",
    "start:cesium": "webpack serve --config=webpack-config/webpack.development-cesium.config.js",
    "prebuild": "npm run prebuild:ol && npm run prebuild:cesium",
    "prebuild:ol": "node task/create-entrypoint-ol.js",
    "prebuild:cesium": "node task/create-entrypoint-cesium.js",
    "build": "webpack --config=webpack-config/webpack.production-ol.config.js && webpack --config=webpack-config/webpack.production-cesium.config.js && npm run copy-legacy",
    "copy-legacy": "node task/copy-to-legacy.js",
    "test-build": "npm run build && live-server --open=test/prod.html",
    "check": "eslint ./src",
    "fix": "eslint --fix ./src"
```
Nota: por lo general, tendrás algunos comandos ya establecidos pero serán necesarios adaptarlos para que permitan sus despliegues tanto en OpenLayers como en Cesium, así como el versionado automático en legacy.

2. Revisa tu configuración de Webpack:
Dentro del plugin existe un directorio webpack-config.
Puedes sustituir los ficheros por el del plugin basic para que cumpla con los requisitos de API-IDEE Community Plugins.
Nota: si tienes configuraciones extras debes añadirlas a estos ficheros.


3. Revisa tus ficheros task:
Dentro del plugin existe un directorio task.
Puedes sustituir los ficheros por el del plugin basic para que cumpla con los requisitos de API-IDEE Community Plugins.
Nota: si tienes configuraciones extras debes añadirlas a estos ficheros.

4. Y no olvides crear el test en la galería.

5. [Revisa las normas](#normas-pull-request) antes de hacer el Pull Request.

6. ¡GRACIAS!


## 📄 Licencia

Los plugins en este repositorio están licenciados bajo la **European Union Public Licence (EUPL) v. 1.2**.

## 🔗 Enlaces Útiles

- [API IDEE - Documentación Oficial](https://github.com/Desarrollos-IDEE/API-IDEE/wiki)
- [Repositorio Principal API-IDEE](https://github.com/Desarrollos-IDEE/API-IDEE)
