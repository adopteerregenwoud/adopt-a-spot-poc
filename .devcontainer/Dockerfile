# Base image
FROM mcr.microsoft.com/dotnet/sdk:8.0

RUN dotnet workload update

# Install Node.js and npm (if not already provided by features)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Create a user with the same UID and GID as the host
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME && \
    mkdir -p /home/$USERNAME/.npm && \
    chown -R $USERNAME:$USERNAME /home/$USERNAME

# Set the default user
USER $USERNAME

# Set the work directory
WORKDIR /workspace
