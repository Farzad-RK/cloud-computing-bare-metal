#!/bin/bash

# Script to delete all volumes in a specified storage pool using virsh
# Usage: ./delete_volumes.sh <pool_name>

# Check if the user provided a pool name
if [ $# -ne 1 ]; then
    echo "Usage: $0 <pool_name>"
    exit 1
fi

POOL_NAME=$1

# Check if the pool exists
echo "Checking if the storage pool '$POOL_NAME' exists..."
if ! virsh pool-info "$POOL_NAME" > /dev/null 2>&1; then
    echo "Error: Storage pool '$POOL_NAME' does not exist."
    exit 1
fi

# List and delete all volumes in the pool
echo "Fetching the list of volumes in the storage pool '$POOL_NAME'..."
VOLUMES=$(virsh vol-list "$POOL_NAME" | grep -v "Volatile" | awk '{print $1}' | tail -n +3)

if [ -z "$VOLUMES" ]; then
    echo "No volumes found in the storage pool '$POOL_NAME'. Nothing to delete."
else
    echo "Deleting all volumes in the storage pool '$POOL_NAME'..."
    for vol in $VOLUMES; do
        echo "Deleting volume: $vol"
        if virsh vol-delete --pool "$POOL_NAME" "$vol"; then
            echo "Successfully deleted volume: $vol"
        else
            echo "Error: Failed to delete volume: $vol"
        fi
    done
fi

# Verify deletion
echo "Verifying that all volumes have been deleted..."
if [ -z "$(virsh vol-list "$POOL_NAME" | grep -v "Volatile" | awk '{print $1}' | tail -n +3)" ]; then
    echo "All volumes in the storage pool '$POOL_NAME' have been deleted successfully."
else
    echo "Warning: Some volumes could not be deleted. Please check manually."
fi

echo "Operation completed."
