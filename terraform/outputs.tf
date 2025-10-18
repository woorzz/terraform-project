# IP publiques pour vérif
output "frontend_public_ip" { value = aws_instance.frontend.public_ip }
output "api_public_ip"      { value = aws_instance.api.public_ip }
output "db_public_ip"       { value = aws_instance.database.public_ip }

# IP privées (debug/routing)
output "frontend_private_ip" { value = aws_instance.frontend.private_ip }
output "api_private_ip"      { value = aws_instance.api.private_ip }
output "db_private_ip"       { value = aws_instance.database.private_ip }
