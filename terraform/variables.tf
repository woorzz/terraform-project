variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "ami_id" {
  description = "Optional explicit AMI ID (if empty we auto-pick Ubuntu 22.04)"
  type        = string
  default     = ""
}

variable "key_pair_name" {
  description = "Name of the AWS Key Pair for SSH access"
  type        = string
  default     = "marinelangrez-forum-keypair"
}

variable "db_password" {
  description = "Password for PostgreSQL database"
  type        = string
  default     = "postgres"
  sensitive   = true
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "github_token" {
  description = "GitHub token (unused if GHCR images are public)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "image_tag" {
  description = "Docker image tag to deploy (e.g. latest or git SHA)"
  type        = string
  default     = "latest"
}

variable "private_key_path" {
  description = "Path to the private key file for SSH access"
  type        = string
  default     = "~/.ssh/marinelangrez-forum-keypair.pem"
}

# GHCR images (public, lowercase)
variable "ghcr_image_api" {
  type    = string
  default = "ghcr.io/woorzz/terraform-project/api"
}
variable "ghcr_image_front" {
  type    = string
  default = "ghcr.io/woorzz/terraform-project/frontend"
}
