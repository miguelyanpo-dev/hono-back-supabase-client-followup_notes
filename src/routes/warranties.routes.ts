import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import {
  WarrantiesQuerySchema,
  WarrantiesListResponse,
  ErrorResponse,
} from '../schemas/warranties.schemas';
import { getWarranties } from '../controllers/warranties/get_warranties';

const WarrantiesRouter = new OpenAPIHono();

// Definimos la ruta en una constante (CLAVE)
const getWarrantiesRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['garantias de aliado'],
  summary: 'Listar garantias',
  description: 'Obtiene garantias (people) desde la API de Aliado.',
  request: {
    query: WarrantiesQuerySchema,
  },
  responses: {
    200: {
      description: 'Lista de garantias obtenida exitosamente',
      content: {
        'application/json': {
          schema: WarrantiesListResponse,
        },
      },
    },
    500: {
      description: 'Error al obtener garantias',
      content: {
        'application/json': {
          schema: ErrorResponse,
        },
      },
    },
  },
});

// MISMO patrón que sellers
// @ts-expect-error - Known issue with @hono/zod-openapi type inference
WarrantiesRouter.openapi(getWarrantiesRoute, getWarranties);

export default WarrantiesRouter;
