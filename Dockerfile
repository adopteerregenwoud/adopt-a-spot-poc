# Stage 1: Build Stage
FROM adopteerregenwoud/adopt-a-spot-vscode-devcontainer AS build

WORKDIR /app

COPY . .

# Build the backend
USER root
RUN whoami && ls -al && dotnet restore AdoptASpotPoC.sln && dotnet publish AdoptASpotPoC.sln -c Release -o out

# Build the frontend
WORKDIR /app/frontend
RUN npm install && npx vite build

# Stage 2: Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set working directory
WORKDIR /app

# Copy the backend publish output from the build stage
COPY --from=build /app/out ./

# Copy the frontend build output to the wwwroot directory
COPY --from=build /app/frontend/dist ./frontend/dist

# Set environment variables
ENV DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 8080

# Run the application
ENTRYPOINT ["dotnet", "AdoptASpotPoC.dll"]
