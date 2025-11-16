# Base image
FROM python:3.11

# Environment
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies including Nginx
RUN apt-get update && apt-get install -y nginx curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project
COPY . .

# Copy Nginx config
COPY server_conf/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy Cloudflare Origin certs
COPY server_conf/certs /etc/certs

# Expose ports (HTTP and HTTPS)
EXPOSE 80 443

# Start Nginx and Django with Gunicorn
CMD service nginx start && \
    python manage.py wait_for_db && \
    python manage.py makemigrations && \
    python manage.py migrate && \
    gunicorn config.wsgi:application --bind 0.0.0.0:8000
