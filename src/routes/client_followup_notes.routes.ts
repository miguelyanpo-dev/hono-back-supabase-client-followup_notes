import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { getClientFollowupNotes } from '../controllers/client_followup_notes/get_client_followup_notes';
import { createClientFollowupNote } from '../controllers/client_followup_notes/create_client_followup_note';
import { getClientFollowupNoteById } from '../controllers/client_followup_notes/get_client_followup_note_by_id';
import { updateClientFollowupNote } from '../controllers/client_followup_notes/update_client_followup_note';
import { deleteClientFollowupNote } from '../controllers/client_followup_notes/delete_client_followup_note';
import { getClientFollowupNotesStats } from '../controllers/client_followup_notes/get_client_followup_notes_stats';
import {
  CreateClientFollowupNoteSchema,
  GetClientFollowupNotesQuerySchema,
  PaginatedClientFollowupNotesResponseSchema,
  UpdateClientFollowupNoteSchema,
} from '../schemas/client_followup_notes.schemas';
import { ErrorResponse, SuccessResponse } from '../schemas/response.schemas';

const router = new OpenAPIHono();

const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

const RefQuerySchema = z.object({
  ref: z.string().optional(),
});

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: {
      query: GetClientFollowupNotesQuerySchema,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: PaginatedClientFollowupNotesResponseSchema,
          },
        },
        description: 'List client followup notes',
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
  getClientFollowupNotes as any
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      query: RefQuerySchema,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: SuccessResponse,
          },
        },
        description: 'Get client followup note by id',
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
  getClientFollowupNoteById as any
);

router.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      query: RefQuerySchema,
      body: {
        content: {
          'application/json': {
            schema: CreateClientFollowupNoteSchema,
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
  createClientFollowupNote as any
);

router.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      query: RefQuerySchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateClientFollowupNoteSchema,
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
  updateClientFollowupNote as any
);

router.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      query: RefQuerySchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateClientFollowupNoteSchema,
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
  updateClientFollowupNote as any
);

router.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: {
      params: IdParamSchema,
      query: RefQuerySchema,
      body: {
        content: {
          'application/json': {
            schema: z.object({
              updated_by_user_name: z.string().optional(),
              updated_by_user_id: z.string().optional(),
            }),
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
  deleteClientFollowupNote as any
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/stats',
    request: {
      query: z.object({
        ref: z.string().optional(),
        client_id: z.string().optional(),
        clients_ids: z.union([z.string(), z.array(z.string())]).optional(),
        tag: z.string().optional(),
        created_by_user_email: z.string().optional(),
        client_name: z.string().optional(),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.object({
                daily: z.record(z.string(), z.number()),
                monthly: z.record(z.string(), z.number()),
              }),
            }),
          },
        },
        description: 'Get client followup notes statistics',
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
  getClientFollowupNotesStats as any
);

export default router;
