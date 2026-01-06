import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { getWarranties } from '../controllers/warranties/get_warranties';
import { createWarranty } from '../controllers/warranties/create_warranty';
import { getWarrantyById } from '../controllers/warranties/get_warranty_by_id';
import { updateWarranty } from '../controllers/warranties/update_warranty';
import { deleteWarranty } from '../controllers/warranties/delete_warranty';
import { CreateWarrantySchema, UpdateWarrantySchema } from '../schemas/warranties.schemas';
import { ErrorResponse, SuccessResponse } from '../schemas/sellers.schemas';

const router = new OpenAPIHono();

const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

const DeleteWarrantyBodySchema = z.object({
  user_updated_name: z.string().optional(),
  user_updated_id: z.string().optional(),
});

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: SuccessResponse,
          },
        },
        description: 'List warranties',
      },
      500: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Internal Server Error',
      },
    },
  }),
  getWarranties as any
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: IdParamSchema,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: SuccessResponse,
          },
        },
        description: 'Get warranty by id',
      },
      400: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Bad Request',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Not Found',
      },
      500: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Internal Server Error',
      },
    },
  }),
  getWarrantyById as any
);

router.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateWarrantySchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: SuccessResponse,
          },
        },
        description: 'Created',
      },
      400: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Bad Request',
      },
      500: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Internal Server Error',
      },
    },
  }),
  createWarranty as any
);

router.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateWarrantySchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: SuccessResponse,
          },
        },
        description: 'Updated',
      },
      400: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Bad Request',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Not Found',
      },
      500: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Internal Server Error',
      },
    },
  }),
  updateWarranty as any
);

router.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateWarrantySchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: SuccessResponse,
          },
        },
        description: 'Updated',
      },
      400: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Bad Request',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Not Found',
      },
      500: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Internal Server Error',
      },
    },
  }),
  updateWarranty as any
);

router.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      body: {
        content: {
          'application/json': {
            schema: DeleteWarrantyBodySchema,
          },
        },
        required: false,
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: SuccessResponse,
          },
        },
        description: 'Deactivated',
      },
      400: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Bad Request',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Not Found',
      },
      500: {
        content: {
          'application/json': {
            schema: ErrorResponse,
          },
        },
        description: 'Internal Server Error',
      },
    },
  }),
  deleteWarranty as any
);

export default router;
