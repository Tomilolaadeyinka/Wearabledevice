"use strict";

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

let ccp;
let wallet;

async function initialize(userType) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "../..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const identity = await wallet.get(userType);
    if (!identity) {
      console.log(
        `An identity for the ${userType} user does not exist in the wallet`
      );
      console.log("Run enrollAdmin.js and registerUser.js before retrying");
      return;
    }
  } catch (error) {
    console.error(`Failed transaction: ${error}`);
    process.exit(1);
  }
}

//Doctor functions
async function doctor_addWDR(userEmail, adderEmail, wdrID, type, content) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "doctor",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");
    // const contract = network.getContract("wdr");

    // "addWDR",
    const result = await contract.submitTransaction(
      "addWDR",
      userEmail,
      adderEmail,
      wdrID,
      type,
      content
    );
    console.log(`Transaction successful. Result : ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`doctor_addWDR: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function doctor_getWDR(wdrID, email) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "doctor",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");

    const result = await contract.submitTransaction("getWDR", wdrID, email);
    console.log(`Transaction successful. Result : ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`doctor_getWDR: Failed transaction: ${error}`);
    return error.toString();
  }
}

// Patient functions
async function patient_addWDR(userEmail, adderEmail, wdrID, type, content) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");
    const result = await contract.submitTransaction(
      "addWDR",
      userEmail,
      adderEmail,
      wdrID,
      type,
      content
    );
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_addWDR: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function patient_getWDR(wdrID, email) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");

    const result = await contract.submitTransaction("getWDR", wdrID, email);
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_getWDR: Failed to evaluate transaction: ${error}`);
    return error.toString();
  }
}

async function patient_grantViewAccess(userEmail, viewerEmail, wdrID) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");

    const result = await contract.submitTransaction(
      "grantViewAccess",
      userEmail,
      viewerEmail,
      wdrID
    );

    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_grantViewAccess: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function patient_revokeViewAccess(userEmail, viewerEmail, wdrID) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");

    const result = await contract.submitTransaction(
      "revokeViewAccess",
      userEmail,
      viewerEmail,
      wdrID
    );
    console.error(`patient_addWDR: Failed transaction: ${error}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(
      `patient_revokeViewAccess: Failed to evaluate transaction: ${error}`
    );
    return error.toString();
  }
}

async function patient_grantAddAccess(userEmail, viewerEmail) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");

    const result = await contract.submitTransaction(
      "grantAddAccess",
      userEmail,
      viewerEmail
    );
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_grantAddAccess: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function patient_revokeAddAccess(userEmail, viewerEmail) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");
    const result = await contract.submitTransaction(
      "revokeAddAccess",
      userEmail,
      viewerEmail
    );
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`patient_revokeAddAccess: Failed transaction: ${error}`);
    return error.toString();
  }
}

//Admin functions
async function admin_addEntityUser(name, email, type) {
  try {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin1",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("wdr");

    const result = await contract.submitTransaction(
      "addEntityUser",
      name,
      email,
      type
    );
    console.log(`Transaction successful. Result is: ${result.toString()}`);

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`admin_addUser: Failed transaction: ${error}`);
    return error.toString();
  }
}

async function viewAllWDR(email) {
  try {
    // create a new gateway for connecting to our peer node.
    console.log("viewAllWDR: " + email);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    // get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // get the contract from the network.
    const contract = network.getContract("wdr");

    // evaluate the specified transaction.
    const result = await contract.submitTransaction("viewAllWDR", email);
    console.log(
      `Transaction has been evaluated. Result is: ${result.toString()}`
    );

    await gateway.disconnect();
    console.log("viewAllWDR: " + typeof result);
    return result;
  } catch (error) {
    console.error(`viewAllWDR: Failed to evaluate transaction: ${error}`);
    return error.toString();
  }
}

async function viewAllUsersWithAddAccess(email) {
  try {
    // create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    // get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // get the contract from the network.
    const contract = network.getContract("wdr");

    // evaluate the specified transaction.
    const result = await contract.submitTransaction(
      "viewAllUsersWithAddAccess",
      email
    );
    console.log(
      `Transaction has been evaluated. Result is: ${result.toString()}`
    );

    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(
      `viewAllUsersWithAddAccess: Failed to evaluate transaction: ${error}`
    );
    return error.toString();
  }
}

// Get granted
async function getGrantedUserForWDR(wdrID, email) {
  try {
    // create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "patient",
      discovery: { enabled: true, asLocalhost: true },
    });

    // get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // get the contract from the network.
    const contract = network.getContract("wdr");
    // const contract = network.getContract("wdr");

    console.log(`send transaction wdrID` + wdrID + " email" + email);

    // evaluate the specified transaction.
    const result = await contract.submitTransaction(
      "getGrantedUserForWDR",
      wdrID,
      email
    );

    console.log(` Result is:: ` + result);
    console.log(
      `Transaction has been evaluated. Result is: ${result.toString()}`
    );

    await gateway.disconnect();

    return result.toString(); // change
  } catch (error) {
    console.error(
      `getGrantedUserForWDR: Failed to evaluate transaction: ${error}`
    );
    return error.toString();
  }
}

exports.initialize = initialize;

exports.doctor_addWDR = doctor_addWDR;
exports.doctor_getWDR = doctor_getWDR;

exports.patient_addWDR = patient_addWDR;
exports.patient_getWDR = patient_getWDR;
exports.patient_grantViewAccess = patient_grantViewAccess;
exports.patient_revokeViewAccess = patient_revokeViewAccess;
exports.patient_revokeAddAccess = patient_revokeAddAccess;
exports.patient_grantAddAccess = patient_grantAddAccess;
exports.viewAllWDR = viewAllWDR;
exports.viewAllUsersWithAddAccess = viewAllUsersWithAddAccess;
exports.getGrantedUserForWDR = getGrantedUserForWDR;

exports.admin_addEntityUser = admin_addEntityUser;
