4. DESIGN AND IMPLEMENTATION

4.1 System Architecture and Infrastructure

The Gym Membership Management System implements a modern three-tier architecture combining containerization, edge computing, and cost-effective hardware platforms to deliver enterprise-grade functionality while maintaining affordability appropriate for small business deployment.

**4.1.1 Deployment Infrastructure Overview**

The system's deployment infrastructure represents a carefully engineered balance between technical sophistication and operational simplicity:

**Hardware Platform: Raspberry Pi 5**

The production deployment utilizes Raspberry Pi 5 Model B as the physical hosting platform, selected for compelling technical and economic advantages:

- **Specifications:**
  - CPU: Broadcom BCM2712 quad-core ARM Cortex-A76 processor @ 2.4GHz
  - RAM: 8GB LPDDR4X-4267 (LPDDR4X providing 33% bandwidth improvement over LPDDR4)
  - Storage: 512GB Kingston NV2 NVMe SSD via PCIe Gen 3 HAT adapter
  - Storage Performance: Sequential read 450MB/s, write 440MB/s (versus ~50MB/s for microSD)
  - Network: Gigabit Ethernet (1000BASE-T) + Wi-Fi 6 (802.11ax) dual-band
  - Video Output: Dual 4K HDMI @ 60Hz via HDMI 2.0 (not utilized in headless server configuration)
  - USB: 2x USB 3.0, 2x USB 2.0 ports
  - GPIO: 40-pin header supporting hardware expansion
  - Power: Official 27W USB-C PD power supply delivering 5.1V @ 5A
  - Cooling: Active cooling solution with PWM-controlled fan maintaining <60°C under sustained load
  - Form Factor: 85mm x 56mm x 17mm (credit card sized)

- **Performance Characteristics:**
  - Geekbench 5 Single-Core: ~500 points (comparable to Intel Core i3-7100U)
  - Geekbench 5 Multi-Core: ~1400 points
  - PCIe Gen 3 bandwidth: 8GT/s enabling NVMe SSD support crucial for database I/O
  - Memory bandwidth: 17GB/s theoretical maximum
  - Idle power consumption: 3-5W
  - Typical load power: 8-12W (web + database + tunnel services)
  - Peak power: 15W (CPU stress + disk I/O + network activity)

- **Cost-Benefit Analysis:**
  - Hardware acquisition: ~₱12,000-15,000 (Pi 5 8GB + NVMe HAT + SSD + cooling + power supply)
  - Monthly electricity: ~₱150-200 @ ₱11/kWh (versus ~₱900-1,200 for traditional x86 server @ 300W)
  - Annual electricity savings: ~₱9,000-12,000 compared to conventional server
  - Carbon footprint: 87kg CO2/year @ 10W average (versus 788kg for 300W server)
  - Silent operation: PWM fan @ 30-40% duty cycle produces <25dB noise
  - No monthly VPS fees: Savings of ₱1,500-3,000/month (₱18,000-36,000 annually) versus commercial hosting

- **Selection Rationale:**
  - ARM64 architecture fully supported by Docker and PostgreSQL official images
  - 8GB RAM sufficient for Django application (512MB), PostgreSQL (1GB), Nginx (128MB), OS (2GB), with 4GB+ buffer
  - NVMe storage critical for database performance (PostgreSQL requires fast random I/O for index operations)
  - Low power consumption enables 24/7 operation without significant electricity expense
  - Physical ownership eliminates recurring hosting fees and provides complete data sovereignty
  - Expandability through GPIO and USB enables future additions (external backup drives, UPS integration, sensor monitoring)

**Containerization: Docker Architecture**

The application stack deploys using Docker Engine with Compose V2 orchestration managing three interdependent services:

```yaml
# docker-compose.yml structure (simplified)
version: '3.8'

services:
  web:
    build: .
    container_name: gymms_web
    image: gymms_django:latest
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 60
    volumes:
      - ./media:/app/media
      - ./static:/app/static
    environment:
      - POSTGRES_DB=gymms_db
      - POSTGRES_USER=gymms_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_HOST=db
      - POSTGRES_PORT=5432
      - SECRET_KEY=${DJANGO_SECRET_KEY}
      - DEBUG=False
    depends_on:
      db:
        condition: service_healthy
    networks:
      - gymms_network
    restart: unless-stopped
    mem_limit: 2g
    cpus: 2.0

  db:
    image: postgres:16-alpine
    container_name: gymms_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      - POSTGRES_DB=gymms_db
      - POSTGRES_USER=gymms_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gymms_user -d gymms_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - gymms_network
    restart: unless-stopped
    mem_limit: 1536m
    shm_size: 256m

  nginx:
    image: nginx:alpine
    container_name: gymms_nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./static:/var/www/static:ro
      - ./media:/var/www/media:ro
    ports:
      - "80:80"
    depends_on:
      - web
    networks:
      - gymms_network
    restart: unless-stopped
    mem_limit: 256m

volumes:
  postgres_data:
    driver: local

networks:
  gymms_network:
    driver: bridge
```

**Container Service Details:**

- **Web Container (gymms_web):**
  - Base Image: python:3.11-slim-bookworm (Debian 12 minimal)
  - Application Server: Gunicorn 21.2.0 with sync worker class
  - Worker Configuration: 3 workers = (2 * CPU cores) + 1 formula for optimal concurrency
  - Worker Timeout: 60 seconds accommodating complex report generation
  - Memory Limit: 2GB preventing runaway processes from consuming system resources
  - CPU Limit: 2.0 cores ensuring database receives adequate CPU share
  - Volume Mounts: 
    - `/app/media` for user-uploaded photos (member/staff profile images)
    - `/app/static` for CSS, JavaScript, compiled assets (Django collectstatic output)
  - Restart Policy: unless-stopped (survives reboots, but manual stop persists)
  - Health Check: HTTP GET to `/health/` endpoint returning 200 OK with system status

- **Database Container (gymms_db):**
  - Base Image: postgres:16-alpine (Alpine Linux minimal footprint ~230MB versus ~350MB for Debian)
  - PostgreSQL Version: 16.1 providing performance improvements and SQL/JSON enhancements
  - Persistent Storage: Named volume `postgres_data` mounted to `/var/lib/postgresql/data`
  - Backup Mount: Host directory `./backups` mounted for pg_dump output storage
  - Shared Memory: 256MB allocated via `shm_size` for PostgreSQL work_mem operations
  - Health Check: `pg_isready` command verifying database accepts connections before web container starts
  - Connection Pooling: PgBouncer considered for future implementation if concurrent connections exceed 50
  - Configuration Tuning:
    - `max_connections = 100` (adequate for small deployment with 3 Gunicorn workers)
    - `shared_buffers = 256MB` (25% of total RAM allocated to database)
    - `effective_cache_size = 1GB` (hint to query planner about available OS cache)
    - `work_mem = 8MB` (per-operation memory for sorting/hashing)
    - `maintenance_work_mem = 128MB` (for VACUUM, CREATE INDEX operations)

- **Nginx Container (gymms_nginx):**
  - Base Image: nginx:alpine (~40MB compressed, minimal attack surface)
  - Configuration: Custom nginx.conf implementing reverse proxy pattern
  - Static File Serving: Direct serving of `/static` and `/media` without Django involvement
  - Compression: gzip enabled for text/css/javascript with compression level 6 (6:1 ratio)
  - Caching Headers: 
    - Static assets: `Cache-Control: public, max-age=31536000` (1 year)
    - Media uploads: `Cache-Control: public, max-age=86400` (1 day)
  - Security Headers:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `X-XSS-Protection: 1; mode=block`
    - `Referrer-Policy: strict-origin-when-cross-origin`
  - Request Buffering: Disabled for uploads to prevent timeout on slow connections
  - Client Max Body Size: 10MB accommodating profile photo uploads

**Docker Networking:**

- Bridge Network: Custom `gymms_network` enabling DNS-based service discovery
- Container Communication: Containers reference each other by service name (e.g., `http://web:8000`)
- Isolation: Default Docker firewall rules prevent external access except explicitly exposed ports
- Port Mapping: Only Nginx port 80 exposed to host (8000 web port internal only)

**Network Architecture: Cloudflare Tunnel**

Traditional hosting approaches require:
- Static public IP address (often unavailable or expensive for residential connections)
- Router port forwarding configuration (security risk opening inbound ports)
- Dynamic DNS if using dynamic IP (additional service dependency)
- Manual SSL certificate management (Let's Encrypt renewal automation complexity)

Cloudflare Tunnel eliminates these requirements through reverse proxy architecture:

**Tunnel Architecture:**

```
┌─────────────────┐         Outbound HTTPS          ┌─────────────────┐
│  Raspberry Pi   │ ───────────────────────────────> │   Cloudflare    │
│                 │        (cloudflared daemon)       │   Edge Network  │
│  - Django App   │                                   │                 │
│  - PostgreSQL   │ <─────────────────────────────── │  - DDoS Shield  │
│  - Nginx        │      Proxied HTTPS Requests       │  - WAF Rules    │
│  - cloudflared  │                                   │  - CDN Cache    │
└─────────────────┘                                   └─────────────────┘
   Local Network                                             │
   192.168.x.x                                               │
   No Port Forward                                           ▼
   No Static IP                                    ┌──────────────────┐
                                                   │   End Users      │
                                                   │   (Browsers)     │
                                                   │                  │
                                                   │  gymms.domain    │
                                                   │  HTTPS + TLS 1.3 │
                                                   └──────────────────┘
```

**Cloudflare Tunnel Implementation:**

- **Installation:**
  ```bash
  # Install cloudflared on Raspberry Pi OS (ARM64)
  wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
  sudo dpkg -i cloudflared-linux-arm64.deb
  
  # Authenticate with Cloudflare account
  cloudflared tunnel login
  # Opens browser to authorize, downloads credentials to ~/.cloudflared/cert.pem
  
  # Create named tunnel
  cloudflared tunnel create gymms-production
  # Generates tunnel ID and credentials file ~/.cloudflared/<tunnel-id>.json
  ```

- **Configuration File (~/.cloudflared/config.yml):**
  ```yaml
  tunnel: <tunnel-id>
  credentials-file: /home/pi/.cloudflared/<tunnel-id>.json
  
  ingress:
    # Public hostname routes to local Nginx
    - hostname: gymms.yourdomain.com
      service: http://localhost:80
      originRequest:
        noTLSVerify: false
        connectTimeout: 30s
        keepAliveTimeout: 90s
    
    # Admin panel restricted via Cloudflare Access
    - hostname: admin.gymms.yourdomain.com
      service: http://localhost:80
      originRequest:
        noTLSVerify: false
    
    # Catch-all returns 404
    - service: http_status:404
  
  # Automatic protocol selection
  protocol: quic
  
  # Logging
  loglevel: info
  logfile: /var/log/cloudflared.log
  ```

- **DNS Configuration:**
  - Cloudflare dashboard creates CNAME records automatically upon tunnel creation
  - `gymms.yourdomain.com` → `<tunnel-id>.cfargotunnel.com`
  - `admin.gymms.yourdomain.com` → `<tunnel-id>.cfargotunnel.com`
  - Cloudflare handles SSL/TLS certificate provisioning and renewal automatically

- **Systemd Service (Auto-start on Boot):**
  ```bash
  # Install as system service
  sudo cloudflared service install
  
  # Enable and start
  sudo systemctl enable cloudflared
  sudo systemctl start cloudflared
  
  # Verify status
  sudo systemctl status cloudflared
  # Should show "active (running)" with tunnel established
  ```

**Cloudflare Tunnel Benefits:**

- **Security:**
  - Zero inbound firewall rules required (all connections originate from Pi to Cloudflare)
  - Origin server IP address hidden from public internet (not exposed in DNS or headers)
  - DDoS protection at Cloudflare edge (absorbs attacks before reaching origin)
  - Web Application Firewall (WAF) rules filtering malicious requests
  - Automatic SSL/TLS with modern cipher suites (TLS 1.3 with PFS)

- **Reliability:**
  - Global anycast network (Cloudflare has 300+ edge locations worldwide)
  - Automatic failover if primary tunnel connection drops
  - Tunnel redundancy: Can run multiple cloudflared instances for high availability
  - Health checks monitoring origin server responsiveness

- **Performance:**
  - CDN caching of static assets at edge locations
  - Brotli/gzip compression reducing bandwidth consumption
  - HTTP/3 and QUIC protocol support for improved latency
  - Argo Smart Routing optimizing path between edge and origin

- **Cost:**
  - Free tier includes unlimited bandwidth for standard tunnels
  - No VPS hosting fees (saves ₱1,500-3,000/month)
  - No domain registration fees if using existing Cloudflare-managed domain

**Access Control (Cloudflare Access):**

For administrative interfaces, Cloudflare Access provides zero-trust authentication:

```yaml
# Access Policy Example (configured via Cloudflare dashboard)
Application: GyMMS Admin Panel
Domain: admin.gymms.yourdomain.com

Policy Rules:
  - Include: Email domain is "yourdomain.com"
  - Include: Email is "owner@email.com"
  - Require: Country is "Philippines"
  - Block: IP in "threat_score > 50"

Session Duration: 24 hours
```

Users accessing `admin.gymms.yourdomain.com` are redirected to Cloudflare login page, authenticate via email OTP or Google OAuth, then receive JWT token granting access for session duration.

**4.1.2 Monitoring and Observability**

Production deployment includes monitoring stack for proactive issue detection:

**System Monitoring (Prometheus + Node Exporter):**

```yaml
# docker-compose.monitoring.yml (additional services)
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: gymms_prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - gymms_network
    restart: unless-stopped

  node_exporter:
    image: prom/node-exporter:latest
    container_name: gymms_node_exporter
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    ports:
      - "9100:9100"
    networks:
      - gymms_network
    restart: unless-stopped

  postgres_exporter:
    image: prometheuscommunity/postgres-exporter:latest
    container_name: gymms_postgres_exporter
    environment:
      DATA_SOURCE_NAME: "postgresql://gymms_user:${DB_PASSWORD}@db:5432/gymms_db?sslmode=disable"
    ports:
      - "9187:9187"
    networks:
      - gymms_network
    depends_on:
      - db
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: gymms_grafana
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"
    networks:
      - gymms_network
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

**Monitored Metrics:**

- **System Metrics (node_exporter):**
  - CPU usage per core (user, system, iowait, idle)
  - Memory utilization (used, cached, buffer, available)
  - Disk I/O (read/write IOPS, throughput MB/s, latency)
  - Network traffic (bytes in/out, packets, errors, drops)
  - System temperature (CPU, SSD via SMART)
  - Load average (1min, 5min, 15min)

- **Application Metrics (Django middleware):**
  - Request rate (requests/second by endpoint)
  - Response time percentiles (p50, p90, p95, p99)
  - Error rate (4xx client errors, 5xx server errors)
  - Active sessions (authenticated users)
  - Database query count and duration
  - Cache hit ratio (if caching enabled)

- **Database Metrics (postgres_exporter):**
  - Active connections (current, max)
  - Idle connections (connection pool efficiency)
  - Transactions per second (commits, rollbacks)
  - Query execution time (slow query identification)
  - Table and index sizes (growth monitoring)
  - Cache hit ratio (buffer pool efficiency)
  - Checkpoint frequency and duration
  - Replication lag (if using standby server)

**Alerting Rules (Prometheus):**

```yaml
# /etc/prometheus/alert.rules.yml
groups:
  - name: gymms_alerts
    interval: 30s
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage above 80% for 10 minutes"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage above 85%"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/mnt/nvme"} / node_filesystem_size_bytes) * 100 < 15
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk space critically low"
          description: "Less than 15% disk space remaining"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(django_http_request_duration_seconds_bucket[5m])) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "95th percentile response time elevated"
          description: "Response time p95 > 2 seconds"

      - alert: DatabaseConnectionPoolExhausted
        expr: pg_stat_database_numbackends > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "More than 90 active connections"
```

**4.1.3 Backup and Disaster Recovery**

**Automated Backup Strategy:**

```bash
#!/bin/bash
# /home/pi/scripts/backup_database.sh

BACKUP_DIR="/mnt/nvme/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="gymms_backup_${TIMESTAMP}.sql.gz"
DAYS_TO_KEEP_DAILY=7
DAYS_TO_KEEP_WEEKLY=28
DAYS_TO_KEEP_MONTHLY=365

# Create backup
docker exec gymms_db pg_dump -U gymms_user -d gymms_db | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

# Verify backup integrity
gunzip -t "${BACKUP_DIR}/${BACKUP_FILE}"
if [ $? -eq 0 ]; then
    echo "Backup successful: ${BACKUP_FILE}"
else
    echo "Backup verification failed!" | mail -s "GyMMS Backup Failure" admin@email.com
    exit 1
fi

# Retention: Keep daily for 7 days
find ${BACKUP_DIR} -name "gymms_backup_*.sql.gz" -mtime +${DAYS_TO_KEEP_DAILY} -type f -delete

# Weekly backups (keep Sunday backups for 4 weeks)
if [ $(date +%u) -eq 7 ]; then
    cp "${BACKUP_DIR}/${BACKUP_FILE}" "${BACKUP_DIR}/weekly_${BACKUP_FILE}"
    find ${BACKUP_DIR} -name "weekly_gymms_backup_*.sql.gz" -mtime +${DAYS_TO_KEEP_WEEKLY} -type f -delete
fi

# Monthly backups (keep first-of-month for 12 months)
if [ $(date +%d) -eq 01 ]; then
    cp "${BACKUP_DIR}/${BACKUP_FILE}" "${BACKUP_DIR}/monthly_${BACKUP_FILE}"
    find ${BACKUP_DIR} -name "monthly_gymms_backup_*.sql.gz" -mtime +${DAYS_TO_KEEP_MONTHLY} -type f -delete
fi

# Sync to external USB drive if mounted
if mountpoint -q /mnt/backup_usb; then
    rsync -av ${BACKUP_DIR}/ /mnt/backup_usb/gymms_backups/
fi

# Sync to cloud storage (optional - using rclone)
# rclone sync ${BACKUP_DIR} remote:gymms-backups --exclude "*.tmp"

exit 0
```

**Cron Schedule:**

```cron
# /etc/cron.d/gymms-backup
# Daily backup at 2:00 AM Philippine Time
0 2 * * * pi /home/pi/scripts/backup_database.sh >> /var/log/gymms_backup.log 2>&1
```

**Disaster Recovery Procedure:**

```bash
# 1. Stop application containers
docker-compose down

# 2. Restore database from backup
gunzip -c /mnt/nvme/backups/gymms_backup_YYYYMMDD_HHMMSS.sql.gz | \
docker exec -i gymms_db psql -U gymms_user -d gymms_db

# 3. Verify data integrity
docker exec gymms_db psql -U gymms_user -d gymms_db -c "SELECT COUNT(*) FROM memberships_member;"
docker exec gymms_db psql -U gymms_user -d gymms_db -c "SELECT COUNT(*) FROM payments_payment;"

# 4. Restart application
docker-compose up -d

# 5. Verify application functionality
curl -I http://localhost/health/
```

**Recovery Time Objective (RTO):** 2 hours maximum from hardware failure to operational restoration

**Recovery Point Objective (RPO):** 24 hours maximum data loss (daily backup schedule)

This infrastructure architecture delivers enterprise-grade reliability, security, and performance while maintaining operational costs below ₱500/month (electricity + domain), demonstrating that sophisticated technical implementations can be accessible to small businesses through thoughtful technology selection and deployment strategies.

