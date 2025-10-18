# ============================================
# EC2 - Database (PostgreSQL)
# ============================================
resource "aws_instance" "database" {
  ami                         = local.effective_ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [aws_security_group.forum_sg.id]
  associate_public_ip_address = true

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -eux
    ${local.docker_install_script}

    POSTGRES_DB="${local.postgres_db}"
    POSTGRES_USER="${local.postgres_user}"
    POSTGRES_PASSWORD="${local.postgres_password}"

    mkdir -p /opt/db
    cat >/opt/db/.env <<EOC
    POSTGRES_DB=$${POSTGRES_DB}
    POSTGRES_USER=$${POSTGRES_USER}
    POSTGRES_PASSWORD=$${POSTGRES_PASSWORD}
    EOC

    cat >/opt/db/docker-compose.yml <<'EOC'
    services:
      db:
        image: postgres:16-alpine
        ports:
          - "5432:5432"
        environment:
          POSTGRES_DB: $${POSTGRES_DB}
          POSTGRES_USER: $${POSTGRES_USER}
          POSTGRES_PASSWORD: $${POSTGRES_PASSWORD}
        volumes:
          - db-data:/var/lib/postgresql/data
        restart: unless-stopped
    volumes:
      db-data:
    EOC

    cd /opt/db
    export $(grep -v '^#' .env | xargs) || true
    docker compose pull
    docker compose up -d
  EOF
  )

  user_data_replace_on_change = true

  tags = {
    Name  = "MarineLangrez-Forum-Database"
    Type  = "Database"
    Owner = "MarineLangrez"
  }
}

# ============================================
# EC2 - API (Node/Express)
# ============================================
resource "aws_instance" "api" {
  ami                         = local.effective_ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [aws_security_group.forum_sg.id]
  associate_public_ip_address = true
  depends_on                  = [aws_instance.database]

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -eux
    ${local.docker_install_script}

    DB_HOST="${aws_instance.database.private_ip}"
    GHCR_IMAGE_API="${local.image_api}"
    GHCR_TAG="${local.image_tag}"
    POSTGRES_DB="${local.postgres_db}"
    POSTGRES_USER="${local.postgres_user}"
    POSTGRES_PASSWORD="${local.postgres_password}"
    DB_PORT="5432"

    mkdir -p /opt/api
    cat >/opt/api/.env <<EOC
    GHCR_IMAGE_API=$${GHCR_IMAGE_API}
    GHCR_TAG=$${GHCR_TAG}
    DB_HOST=$${DB_HOST}
    DB_PORT=$${DB_PORT}
    POSTGRES_DB=$${POSTGRES_DB}
    POSTGRES_USER=$${POSTGRES_USER}
    POSTGRES_PASSWORD=$${POSTGRES_PASSWORD}
    EOC

    cat >/opt/api/docker-compose.yml <<'EOC'
    services:
      api:
        image: $${GHCR_IMAGE_API}:$${GHCR_TAG}
        ports:
          - "3000:3000"
        environment:
          NODE_ENV: production
          HOST: 0.0.0.0
          API_PORT: 3000
          DB_HOST: $${DB_HOST}
          DB_PORT: $${DB_PORT}
          DB_NAME: $${POSTGRES_DB}
          DB_USER: $${POSTGRES_USER}
          DB_PASSWORD: $${POSTGRES_PASSWORD}
        restart: unless-stopped
    EOC

    cd /opt/api
    export $(grep -v '^#' .env | xargs) || true
    docker compose pull
    docker compose up -d
  EOF
  )

  user_data_replace_on_change = true

  tags = {
    Name  = "MarineLangrez-Forum-API"
    Type  = "API"
    Owner = "MarineLangrez"
  }
}

# ============================================
# EC2 - Frontend (Nginx)
# ============================================
resource "aws_instance" "frontend" {
  ami                         = local.effective_ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [aws_security_group.forum_sg.id]
  associate_public_ip_address = true
  depends_on                  = [aws_instance.api]

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -eux
    ${local.docker_install_script}

    API_HOST="${aws_instance.api.private_ip}"
    API_PORT="3000"
    GHCR_IMAGE_FRONT="${local.image_front}"
    GHCR_TAG="${local.image_tag}"

    mkdir -p /opt/frontend

    # Nginx conf (front + proxy /api -> API)
    cat >/opt/frontend/nginx.conf <<EOC
    server {
      listen 80 default_server;
      server_name _;
      root /usr/share/nginx/html;
      index index.html;

      add_header X-Content-Type-Options nosniff;
      add_header X-Frame-Options SAMEORIGIN;

      location / {
        try_files \$uri \$uri/ =404;
      }

      location /api/ {
        proxy_pass http://$${API_HOST}:$${API_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Connection "";
      }

      location /nginx/health {
        return 200 "ok";
        add_header Content-Type text/plain;
      }
    }
    EOC

    cat >/opt/frontend/.env <<EOC
    GHCR_IMAGE_FRONT=$${GHCR_IMAGE_FRONT}
    GHCR_TAG=$${GHCR_TAG}
    EOC

    cat >/opt/frontend/docker-compose.yml <<'EOC'
    services:
      nginx:
        image: $${GHCR_IMAGE_FRONT}:$${GHCR_TAG}
        ports:
          - "80:80"
        volumes:
          - /opt/frontend/nginx.conf:/etc/nginx/conf.d/default.conf:ro
        restart: unless-stopped
    EOC

    cd /opt/frontend
    export $(grep -v '^#' .env | xargs) || true
    docker compose pull
    docker compose up -d
  EOF
  )

  user_data_replace_on_change = true

  tags = {
    Name  = "MarineLangrez-Forum-Frontend"
    Type  = "Frontend"
    Owner = "MarineLangrez"
  }
}
