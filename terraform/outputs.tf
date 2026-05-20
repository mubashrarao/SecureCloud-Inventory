output "server_public_ip" {
  description = "Public IP of the DevOps server"
  value       = aws_eip.devops_eip.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the server"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_eip.devops_eip.public_ip}"
}

output "server_id" {
  description = "EC2 instance ID"
  value       = aws_instance.devops_server.id
}
