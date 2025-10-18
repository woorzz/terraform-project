data "aws_ami" "ubuntu" {
  count       = var.ami_id == "" ? 1 : 0
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

locals {
  effective_ami_id   = var.ami_id != "" ? var.ami_id : data.aws_ami.ubuntu[0].id
  postgres_db        = "appdb"
  postgres_user      = "appuser"
  postgres_password  = var.db_password

  image_api          = var.ghcr_image_api
  image_front        = var.ghcr_image_front
  image_tag          = var.image_tag

  # Docker installation script
  docker_install_script = <<-SCRIPT
    apt-get update -y
    apt-get install -y docker.io curl
    systemctl enable --now docker
    
    # Install Docker Compose v2
    DOCKER_COMPOSE_VERSION="v2.24.0"
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL "https://github.com/docker/compose/releases/download/$${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" \
      -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  SCRIPT
}
