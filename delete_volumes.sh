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

# Start the pool if it is not already active
echo "Ensuring the storage pool '$POOL_NAME' is active..."
if ! virsh pool-info "$POOL_NAME" | grep -q "Active:.*yes"; then
    echo "Starting the storage pool '$POOL_NAME'..."
    if virsh pool-start "$POOL_NAME"; then
        echo "Storage pool '$POOL_NAME' started successfully."
    else
        echo "Error: Failed to start storage pool '$POOL_NAME'."
        exit 1
    fi
else
    echo "Storage pool '$POOL_NAME' is already active."
fi

# List and delete all volumes in the pool
echo "Fetching the list of volumes in the storage pool '$POOL_NAME'..."
VOLUMES=$(virsh vol-list "$POOL_NAME" --name)

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
if [ -z "$(virsh vol-list "$POOL_NAME" --name)" ]; then
    echo "All volumes in the storage pool '$POOL_NAME' have been deleted successfully."
else
    echo "Warning: Some volumes could not be deleted. Please check manually."
fi

echo "Operation completed."
