# Adopt-A-Spot Proof of Concept

## Doel

Doel van deze PoC is om te kijken hoe ik een gebruiker in staat ga stellen om
zijn geadopteerde vierkante meters te selecteren op een kaart.
Deze PoC beperkt zich tot het bekijken van de kaart (zoom/pan) en het aanklikken
van een aantal vierkante meters.

## Technieken

### IDE

- Visual Studio Code
- DevContainer met daarin 
    - .NET SDK 8.0
    - Node 18

### Backend

- C#
- [ASP.NET Core 8.0](https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-8.0)
- [Swashbuckle/Swagger](https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-8.0&tabs=visual-studio)

### Frontend

- TypeScript
- Node 18
- Unit test framework: [Jest](https://jestjs.io/)
- Framework: [Lit](https://lit.dev/docs/)
- Packager: [Vite](https://vite.dev/)

### Deploy

- Docker
