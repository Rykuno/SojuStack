# Backend DTO And OpenAPI

Use this reference when changing controller responses, DTOs, Swagger metadata, serialization behavior, or any backend code that affects generated OpenAPI output.

## API Contract Preservation

- Treat `apps/api/generated/openapi.d.ts` as generated output, not hand-authored source.
- Use the existing DTO, Swagger, and serialization patterns in the touched module so runtime responses and generated types stay aligned.
- If a controller response changes, make sure its DTO, response decorator metadata, and serialization or interceptor path still describe the real payload.
- When backend contract work affects the web app, update the backend source of truth first and then adapt frontend code to the refreshed generated types.

## DTO And Serialization Expectations

- Prefer existing module DTO conventions over inventing a parallel response-shaping system.
- Keep transport DTOs explicit when the API surface is public or consumed by the web app.
- Avoid silent response-shape changes that bypass Swagger-visible decorators or serializer paths.
