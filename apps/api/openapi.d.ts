export interface paths {
  '/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AppController_getHello'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/health': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HealthController_check'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: never;
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  AppController_getHello: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  HealthController_check: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The Health Check is successful */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example ok */
            status?: string;
            /**
             * @example {
             *       "database": {
             *         "status": "up"
             *       }
             *     }
             */
            info?: {
              [key: string]: {
                status: string;
              } & {
                [key: string]: unknown;
              };
            } | null;
            /** @example {} */
            error?: {
              [key: string]: {
                status: string;
              } & {
                [key: string]: unknown;
              };
            } | null;
            /**
             * @example {
             *       "database": {
             *         "status": "up"
             *       }
             *     }
             */
            details?: {
              [key: string]: {
                status: string;
              } & {
                [key: string]: unknown;
              };
            };
          };
        };
      };
      /** @description The Health Check is not successful */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example error */
            status?: string;
            /**
             * @example {
             *       "database": {
             *         "status": "up"
             *       }
             *     }
             */
            info?: {
              [key: string]: {
                status: string;
              } & {
                [key: string]: unknown;
              };
            } | null;
            /**
             * @example {
             *       "redis": {
             *         "status": "down",
             *         "message": "Could not connect"
             *       }
             *     }
             */
            error?: {
              [key: string]: {
                status: string;
              } & {
                [key: string]: unknown;
              };
            } | null;
            /**
             * @example {
             *       "database": {
             *         "status": "up"
             *       },
             *       "redis": {
             *         "status": "down",
             *         "message": "Could not connect"
             *       }
             *     }
             */
            details?: {
              [key: string]: {
                status: string;
              } & {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
  };
}
