#Number of the nodes in the cluster
variable "control_plane_nodes" {
  type = number
  default = 1
}

variable "worker_nodes" {
  type = number
  default = 2
}

variable "cp_prefix" {
  type = string
  default = "control-plane-"
}

variable "worker_prefix" {
  type = string
  default = "worker-node-"
}

#Control plane node specs
variable "cp_cpu" {
  type = number
  default = 1
}

variable "cp_disk" {
  type = number
  default = 15
}

variable "cp_memory" {
  type = number
  default = 1024
}

variable "cp_diskpool" {
  type = string
  default = "dfs_images"
}

#Worker node specs
variable "worker_cpu" {
  type = number
  default = 1
}

variable "worker_disk" {
  type = number
  default = 15
}

variable "worker_memory" {
  type = number
  default = 1024
}

variable "worker_diskpool" {
  type = string
  default = "dfs_images"
}

#Default user config for ssh

variable "privateuser" {
  type = string
  default = "leviathan"
}

variable "privatekey" {
  type = string
  default = "~/.ssh/id_rsa"
}

variable "pubkey" {
  type = string
  default = "~/.ssh/id_rsa.pub"
}

variable "timezone" {
  type = string
  default = "CET"
}

variable "osimg" {
  type = string
  #Path to Os image file.A URL could be used especially if we are dealing with
  #a cloud platform like AWS.
  default = "file:///home/leviathan/os-images/jammy-server-cloudimg-amd64.img"
}