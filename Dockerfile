# Base image with NGINX
FROM nginx:1.23.0

# Install Node.js and build tools
RUN apt-get update && apt-get install -y \
    curl gnupg2 ca-certificates \
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 \
    libxss1 libasound2 libxtst6 xauth xvfb g++ make

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /src/build-your-own-radar

# Copy source code
COPY . .

# Install dependencies and build the app
RUN npm ci && npm run build

# Copy built files to NGINX web root
RUN cp -r dist/* /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]