# LangRec Server

## Open Endpoints

Open endpoints require no Authentication.

SignUp: POST /api/users/
Login : POST /api/authorization/login/
Get Recs: GET /api/resources/recs

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the request. Token can be access from login request.

Get saved resources : GET /api/resources/saved-resources
Save a resource: POST /api/resources/recs
Remove a saved resource : DELETE /api/resources/saved-resources/:resource_id
