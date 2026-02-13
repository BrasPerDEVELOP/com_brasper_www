# Dash Brasper V2

Aplicación Vue.js con TypeScript siguiendo una arquitectura modular.

## Estructura del Proyecto

```
src/
├── interface/              # Código compartido (navegación, temas, widgets base)
│   ├── router/            # Configuración de rutas
│   ├── styles/            # Estilos globales
│   ├── theme/             # Configuración de temas
│   └── widgets/           # Widgets base reutilizables
├── main.ts                # Punto de entrada de la aplicación
├── App.vue                # Componente raíz
└── modules/               # Módulos de la aplicación
    ├── auth/              # Autenticación
   
```

## Estructura de un Módulo

Cada módulo sigue la arquitectura por capas:

```
module/
├── application/
│   └── use_cases/         # Casos de uso (lógica de negocio)
├── domain/
│   └── models/            # DTOs y modelos de dominio
├── infrastructure/
│   └── adapters/          # Adaptadores (API, repositorios)
└── presentation/
    ├── bodies/            # Vistas/pantallas principales
    ├── controllers/       # Stores de Pinia (gestión de estado)
    └── widgets/           # Widgets reutilizables del módulo
```

## Tecnologías

- **Vue 3** - Framework frontend
- **TypeScript** - Tipado estático
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento
- **Vite** - Build tool y dev server
- **Axios** - Cliente HTTP (para futuras integraciones)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Arquitectura

### Capas

1. **Domain**: Modelos y entidades del dominio
2. **Application**: Casos de uso que orquestan la lógica de negocio
3. **Infrastructure**: Implementaciones concretas (API, almacenamiento)
4. **Presentation**: Componentes Vue, stores y widgets

### Flujo de Datos

1. El usuario interactúa con un componente en `presentation/bodies/`
2. El componente usa un store de Pinia en `presentation/controllers/`
3. El store ejecuta un caso de uso de `application/use_cases/`
4. El caso de uso usa un adaptador de `infrastructure/adapters/`
5. El adaptador hace la llamada a la API o fuente de datos
6. Los datos fluyen de vuelta a través de las capas hasta el componente

## Módulos

### Auth
Manejo de autenticación y sesión de usuarios.

### Commercial
Gestión de ventas, leads, tickets y procesos comerciales.

### Company
Administración de áreas, cargos, roles y usuarios de la empresa.

### Global
Configuración global: monedas, tipos de documento, razones sociales.### Projects
Gestión de proyectos, fases, bloques, lotes y unidades.

---

## Variables de entorno (.env)

Copia `.env.example` a `.env` y ajusta los valores. Solo se exponen variables con prefijo `VITE_`.

| Variable       | Uso |
|----------------|-----|
| `VITE_DARK`    | Tema oscuro (true) o claro (false) |
| `VITE_SSL`     | Usar HTTPS (true) o HTTP (false). Lo usa Domain para armar la URL base |
| `VITE_DOMAIN`  | Dominio de la API, ej. `api.demo.zefiron.com` |
| `VITE_COMPANY` | Opcional: prefijo de ruta (empresa/tenant) |
| `VITE_COUNTRY` | País por defecto |
| `VITE_USERNAME`| Prellenar usuario en login (desarrollo) |
| `VITE_PASSWORD`| Prellenar contraseña en login (desarrollo) |

El adapter genérico **no lee el .env**; solo usa `Domain.http(path)`, y **Domain** es quien lee SSL, DOMAIN y COMPANY.

---

## Adapter genérico

- **Domain**: `src/interface/infrastructure/services/domain.ts`  
  `Domain.http(path)` construye la URL: `(https|http)://DOMAIN[/COMPANY]path`.

- **Adapter&lt;T&gt;**: `src/interface/infrastructure/services/adapter.ts`  
  Recibe `path`, `tryParse` (JSON → DTO) y opcionalmente `getToken` (p. ej. `() => useAuthStore().token`).  
  Métodos: `get(id)`, `post(body)`, `put(id, body)`, `delete(id)`, `getList()`, y helpers `makeDTO`, `makeDTOList`, `makePagination`, `makeBool`.

En cada módulo, el adapter concreto crea un `Adapter<T>(path, tryParse, getToken)` y delega las peticiones. Ejemplo: `ProjectsApiAdapter` usa `Adapter<Project>('/project/', parseProject, getToken)` y en el store se pasa `getToken: () => useAuthStore().token`.

---

## Traducciones (i18n)

1. **Archivos de texto**:  
   - `src/interface/presentation/i18n/es.json`  
   - `src/interface/presentation/i18n/en.json`  
   Mismas claves en ambos; valor es el texto en cada idioma.

2. **Generar claves TR**:  
   ```bash
   npm run i18n:generate
   ```  
   Lee `es.json` y genera `src/interface/domain/generated/tr.ts` con una constante `TR` cuyos getters están en camelCase y devuelven la **clave** (no el texto). Ejemplo: `TR.forgotPassword` → `"forgot_password"`.

3. **Uso en la app**:  
   Con vue-i18n: `t(TR.create)` o en plantilla `{{ t(TR.login) }}`. El idioma actual se configura en `src/interface/presentation/i18n/index.ts` (locale, fallbackLocale).

4. **Añadir una traducción**:  
   Añade la clave y el texto en `es.json` y `en.json`, luego ejecuta `npm run i18n:generate`. No edites `tr.ts` a mano (está autogenerado).
