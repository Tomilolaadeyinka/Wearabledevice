# WDR Management System using Hyperledger Fabric

## Introduction

Our project is a big step forward because it integrates the cutting-edge idea of blockchain into Wearable Device Records (WDRs). To improve patient data security and confidentiality, blockchain integration is the main goal. Blockchain uses a decentralized mechanism to store data, making it extremely safe and impenetrable. This method guarantees that patient data is secure and unaffected by unauthorized changes.

This repository contains scripts and configurations to set up a Hyperledger Fabric network and deploy a chaincode.


## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Tomilolaadeyinka/Wearabledevice.git
   ```

2. **Navigate to the test network directory:**

   ```bash
   cd wearabledevice/fabric-samples/test-network

   ```

3. **Execute the following commands to set up the network and deploy the chaincode:**

   ```bash
   ./network.sh down
   ./network.sh up createChannel -ca -s
   ./deploymentScript.sh
   ```

4. **After the execution of the above commands, navigate to the backend-combined directory:**

   ```bash
   cd ../backend-combined
   ```

5. **Enroll admin, register user, and start the application:**

   ```bash
   node enrollAdmin.js
   node registerUser.js
   node app.js
   ```

6. **To view Frontend**

```
    cd ../frontend-combined
    Run adminApplication.html
```
