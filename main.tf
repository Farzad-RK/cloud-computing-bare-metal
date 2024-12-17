terraform {
  required_providers {
    libvirt = {
      source = "dmacvicar/libvirt"
      version = "0.8.1"
    }
  }
}

provider "libvirt" {
  uri = "qemu:///system"
}

module "controlplane" {
  source  = "MonolithProjects/vm/libvirt"
  version = "1.12.0"

  vm_hostname_prefix = var.cp_prefix
  vm_count    = var.control_plane_nodes
  memory      = var.cp_memory
  vcpu        = var.cp_cpu
  pool        = var.cp_diskpool
  system_volume = var.cp_disk
  dhcp        = false
  ip_address = [ "10.0.1.2"]
  ip_gateway = "10.0.1.1"
  ip_nameserver = "10.0.1.1"
  ssh_admin   = var.privateuser
  ssh_private_key = var.privatekey
  ssh_keys    = [
    file(var.pubkey),
  ]
  time_zone   = var.timezone
  os_img_url  = var.osimg
}

# Module for building our worker nodes

module "worker" {
  source  = "MonolithProjects/vm/libvirt"
  version = "1.10.0"

  vm_hostname_prefix = var.worker_prefix
  vm_count    = var.worker_nodes
  memory      = var.worker_memory
  vcpu        = var.worker_cpu
  pool        = var.worker_diskpool
  system_volume = var.worker_disk
  dhcp        = false
  ip_address = [ "10.0.1.3", "10.0.1.4" ]
  ip_gateway = "10.0.1.1"
  ip_nameserver = "10.0.1.1"
  ssh_admin   = var.privateuser
  ssh_private_key = var.privatekey
  ssh_keys    = [
    file(var.pubkey),
  ]
  time_zone   = var.timezone
  os_img_url  = var.osimg
}

output "control-planes" {
  value = module.controlplane
}

output "worker-nodes" {
  value = module.worker
}