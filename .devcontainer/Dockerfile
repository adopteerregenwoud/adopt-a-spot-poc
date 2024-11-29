FROM mcr.microsoft.com/dotnet/sdk:8.0

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    dotnet workload update && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* ~/.cache ~/.npm/_logs

# Override these to use the logged in user, so created directories will have the correct owner.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME && \
    mkdir -p /home/$USERNAME/.npm && \
    chown -R $USERNAME:$USERNAME /home/$USERNAME

USER $USERNAME

# Make sure https works (with a self-signed certificate):
RUN dotnet dev-certs https --trust

WORKDIR /workspace
