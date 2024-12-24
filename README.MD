# Management of Virtual Machines Using Terraform and Virsh

This guide provides step-by-step instructions for setting up and managing virtual machines (VMs) using Terraform, Libvirt, and Virsh. It includes details on installation, configuration, and troubleshooting.

---

## Prerequisites

Ensure your system meets the following requirements before proceeding:

- A system running a supported Linux distribution (e.g., Ubuntu 22.04 LTS or similar).
- Administrative (sudo) privileges.
- Installed packages: `gnupg`, `software-properties-common`, and `curl`.

---

## Installation Instructions

### Installing Terraform

1. **Update System Packages**
   ```bash
   sudo apt-get update && sudo apt-get install -y gnupg software-properties-common curl
   ```

2. **Install the HashiCorp GPG Key**
   ```bash
   wget -O- https://apt.releases.hashicorp.com/gpg | \
   gpg --dearmor | \
   sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
   ```

3. **Verify the GPG Fingerprint**
   ```bash
   gpg --no-default-keyring \
   --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
   --fingerprint
   ```

4. **Add the HashiCorp Repository**
   ```bash
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
   https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
   sudo tee /etc/apt/sources.list.d/hashicorp.list
   ```

5. **Update the Repositories**
   ```bash
   sudo apt update
   ```

6. **Install Terraform**
   ```bash
   sudo apt-get install terraform
   ```

---

### Installing Libvirt and QEMU

Libvirt is a toolkit for managing virtualization platforms such as KVM and QEMU.

1. **Update System Packages**
   ```bash
   sudo apt update
   ```

2. **Install Required Packages**
   ```bash
   sudo apt install qemu-kvm libvirt-daemon-system
   ```

---

## Using Terraform

### Initializing Terraform

After defining your Terraform scripts, initialize your Terraform environment:

1. **Run the Initialization Command**
   ```bash
   terraform init
   ```

   This performs the following actions:
    - Downloads provider plugins (e.g., AWS, Azure, GCP).
    - Sets up the backend for storing the Terraform state.
    - Downloads modules specified in the configuration.
    - Verifies the configuration.

### Deploying Terraform Plans

1. **Apply the Terraform Plan**
   ```bash
   terraform apply
   ```

   This performs the following actions:
    - Generates an execution plan.
    - Prompts for approval of changes (use `-auto-approve` to skip).
    - Applies the changes to create, update, or destroy resources as needed.

2. **Destroy Resources**
   ```bash
   terraform destroy
   ```
   Note: If you manually remove resources, the state file may retain outdated entries, causing errors.

### Managing State

1. **List Resources in the State File**
   ```bash
   terraform state list
   ```

2. **Remove a Specific Resource**
   ```bash
   terraform state rm [resource_name]
   ```

---

## Managing Virtual Machines with Virsh

### Common Virsh Commands

1. **List All Storage Pools**
   ```bash
   virsh pool-list --all
   ```

2. **List Volumes Inside a Storage Pool**
   ```bash
   virsh vol-list <pool_name>
   ```

3. **Delete a Volume Inside a Pool**
   ```bash
   virsh vol-delete <volume_name> --pool <pool_name>
   ```

---

## Troubleshooting

### Terraform State Errors

- **Error:**
  ```
  error retrieving volume for disk: Storage volume not found: no storage vol with matching name 'worker-node-01.qcow2'
  ```
  **Cause:** The state file tracks changes made by Terraform only.

- **Solution:**
    1. Use `terraform state list` to identify resources.
    2. Remove faulty resources with:
       ```bash
       terraform state rm [resource_name]
       ```

### Resource Outputs

- **Example Output After Apply Command:**
  ```
  Outputs:

  control-planes = {
    "ip_address" = [
      "10.0.1.212",
    ]
    "name" = [
      "control-plane-01",
    ]
  }

  worker-nodes = {
    "ip_address" = [
      "10.0.1.215",
      "10.0.1.86",
    ]
    "name" = [
      "worker-node-01",
      "worker-node-02",
    ]
  }
  ```

---

## Additional Notes

- Terraform can provision an existing Kubernetes cluster but not create one directly.

---

## Conclusion

This guide outlines the installation and usage of Terraform and Virsh for managing VMs. For further exploration, refer to Terraform and Libvirt official documentation.
