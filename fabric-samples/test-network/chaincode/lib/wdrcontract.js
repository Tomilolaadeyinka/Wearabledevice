"use strict";

const { Contract } = require("fabric-contract-api");





class User {
  constructor(name, email, userType, ownedWDRList, addedUserList) {
    this.name = name; 
    this.email = email; 
    this.userType = userType; 
    this.ownedWDRList = ownedWDRList; 
    this.addedUserList = addedUserList; 
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getType() {
    return this.userType;
  }

  getOwns() {
    return this.ownedWDRList;
  }

  getaddedUserList() {
    return this.addedUserList;
  }
  
  setName(name) {
    this.name = name;
  }

  setEmail(email) {
    this.email = email;
  }

  setType(userType) {
    this.userType = userType;
  }

  setOwns(ownedWDRList) {
    this.ownedWDRList = ownedWDRList;
  }

  setaddedUserList(addedUserList) {
    this.addedUserList = addedUserList;
  }

  checkPermissionForUser(email) {
    let pos = this.addedUserList.indexOf(email);
    if (pos === -1) return false;
    return true;
  }

  

  static deserialize(data) {
    return new User(
      data.name,
      data.email,
      data.userType,
      data.ownedWDRList,
      data.addedUserList
    );
  }
}

class WDR {
  constructor(
    ID,
    recordOwner,
    recordAdder,
    recordType,
    recordContent,
    recordCreationDate,
    permittedList
  ) {
    this.ID = ID; 
    this.recordOwner = recordOwner; 
    this.recordAdder = recordAdder; 
    this.recordType = recordType; 
    this.recordContent = recordContent; 
    this.recordCreationDate = recordCreationDate; 
    this.permittedList = permittedList; 
  }

  
  getID() {
    return this.ID;
  }

  getRecordOwner() {
    return this.recordOwner;
  }

  getRecordAdder() {
    return this.recordAdder;
  }

  getRecordType() {
    return this.recordType;
  }

  getrecordCreationDate() {
    return this.recordCreationDate;
  }

  getContent() {
    return this.recordContent;
  }

  getPermittedList() {
    return this.permittedList;
  }

  checkUserInPermittedList(ID) {
    let pos = this.permittedList.indexOf(ID);
    if (pos === -1) return false;
    return true;
  }
  
  setID(ID) {
    this.ID = ID;
  }

  setRecordOwner(recordOwner) {
    this.recordOwner = recordOwner;
  }

  setRecordAdder(recordAdder) {
    this.recordAdder = recordAdder;
  }

  setRecordType(recordType) {
    this.recordType = recordType;
  }

  setRecordCreationDate(recordCreationDate) {
    this.recordCreationDate = recordCreationDate;
  }

  setContent(recordContent) {
    this.recordContent = recordContent;
  }

  setPermittedList(permittedList) {
    this.permittedList = permittedList;
  }

  static deserialize(data) {
    return new WDR(
      data.ID,
      data.recordOwner,
      data.recordAdder,
      data.recordType,
      data.recordContent,
      data.recordCreationDate,
      data.permittedList
    );
  }
}



class WDRContract extends Contract {
  async initLedger(ctx) {
    const users = [
      {
        name: "Snehal Chaudhari",
        email: "snehalchaudhari@gmail.com",
        userType: "patient",
      },
      {
        name: "David Scott",
        email: "david@gmail.com",
        userType: "doctor",
      },
      {
        name: "Rahil Hastu",
        email: "rahilHastu@gmail.com",
        userType: "patient",
      },
      {
        name: "Shreya Gore",
        email: "shreyagore@gmail.com",
        userType: "patient",
      },
      {
        name: "Aebs Jacob",
        email: "aebsj@gmail.com",
        userType: "doctor",
      },
    ];
    for (let i = 0; i < users.length; i++) {
      await this.addEntityUser(
        ctx,
        users[i].name,
        users[i].email,
        users[i].userType
      );
    }

    return users;
  }

  async initWDR(ctx) {
    const wdrs = [
      {
        ID: "01",
        recordOwner: "rahilHastu@gmail.com",
        recordAdder: "david@gmail.com",
        recordType: "medical",
        recordContent: `Dummy record 1`,
      },

      {
        ID: "02",
        recordOwner: "rahilHastu@gmail.com",
        recordAdder: "aebsj@gmail.com",
        recordType: "test",
        recordContent: `   dummy record 2  `,
      },
    ];

    for (let i = 0; i < wdrs.length; i++) {
      await this.addWDR(
        ctx,
        wdrs[i].recordOwner,
        wdrs[i].recordAdder,
        wdrs[i].ID,
        wdrs[i].recordType,
        wdrs[i].recordContent
      );
    }
    return wdrs;
  }

  async addEntityUser(ctx, name, email, type) {
    
    let key = ctx.stub.createCompositeKey("User", [email]);
    const userAsBytes = await ctx.stub.getState(key);
    if (userAsBytes.length > 0) {
      //refactor error message
        
           throw new Error(`User with ID: ${email} already exist`);
    }
  
    var ownedWDRList = new Array();
    var addedUserList = new Array();

    
    const user = new User(name, email, type, ownedWDRList, addedUserList);
   
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
    return `User with ID: ${email} successfully added to system`;
  }

  async addWDR(ctx, userID, adder, ID, type, content) {    
    let key = ctx.stub.createCompositeKey("User", [userID]);
    const userAsBytes = await ctx.stub.getState(key);
    
    if (userAsBytes.length === 0) {
      throw new Error(`User with ID: ${userID} doesn't exist`);
    }

    let adderKey = ctx.stub.createCompositeKey("User", [adder]);
    const adderAsBytes = await ctx.stub.getState(adderKey);

    if (adderAsBytes.length === 0) {
      throw new Error(`User with ID: ${adder} doesn't exist`);
    }
    
    const user = User.deserialize(JSON.parse(userAsBytes.toString()));
    
    if (user.checkPermissionForUser(adder) === false) {
      throw new Error(
        `User with ID: ${adder} does not have permission to add for user: ${userID}`
      );
    }
    
    else {
      const wdrKey = ctx.stub.createCompositeKey("WDR", [ID]);
      const wdrAsBytes = await ctx.stub.getState(wdrKey);
      
      if (wdrAsBytes.length > 0) {
        throw new Error(`WDR with ID: ${ID}  already exist`);
      } else {
        
        user.ownedWDRList.push(ID);
        var getDateString = function () {
          var sp = "/";
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1; 
          var yyyy = today.getFullYear();
          if (dd < 10) dd = "0" + dd;
          if (mm < 10) mm = "0" + mm;
          return dd + sp + mm + sp + yyyy;
        };
        
        const permittedList = new Array();
        permittedList.push(userID);
        

        const wdr = new WDR(
          ID,
          userID,
          adder,
          type,
          content,
          getDateString(),
          permittedList
        );
        
        await ctx.stub.putState(wdrKey, Buffer.from(JSON.stringify(wdr)));
        
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
        return `
        WDR with ID: ${ID} successfully added with following info
        recordOwner: ${userID}
        adder: ${adder}
        type: ${type}
        creation date: ${wdr.getrecordCreationDate()} 
        `;
      }
    }
  }

  async getWDR(ctx, wdrID, email) {
    
    const key = ctx.stub.createCompositeKey("WDR", [wdrID]);
    const wdrAsBytes = await ctx.stub.getState(key);
    
    if (wdrAsBytes.length === 0) {
      throw new Error(`WDR with ID: ${wdrID} does not exist`);
    }

    let key2 = ctx.stub.createCompositeKey("User", [email]);
    const userAsBytes = await ctx.stub.getState(key2);
    
    if (userAsBytes.length === 0) {
      console.info("Here is an error");
      
      throw new Error(`User with ID: ${email} doesn't exist`);
    }
    
    const wdr = WDR.deserialize(JSON.parse(wdrAsBytes.toString()));
    if (wdr.checkUserInPermittedList(email) === true) {
      return wdr.getContent();
    } else {
      throw new Error(
        `User with ID ${email} doesn't have access permission to WDR with ID: ${wdrID}`
      );
    }
  }

  
  async viewAllWDR(ctx, userEmail) {
    
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    
    if (userAsBytes.length === 0) {
      throw new Error(`${key} does not exist`);
    }

    
    const user = User.deserialize(JSON.parse(userAsBytes.toString()));
    const wdrIDs = user.getOwns();
    
    if (wdrIDs.length > 0) {
      const wdrs = [];
      for (let i = 0; i < wdrIDs.length; i++) {
        const wdrKey = ctx.stub.createCompositeKey("WDR", [wdrIDs[i]]);
        const wdrAsBytes = await ctx.stub.getState(wdrKey);
        const wdr = WDR.deserialize(JSON.parse(wdrAsBytes.toString()));
        
        
        wdrs.push([
          wdr.getRecordAdder(),
          wdr.getRecordType(),
          wdr.getContent(),
          wdr.getrecordCreationDate(),
          wdr.getPermittedList().length,
        ]);
      }

      
      return wdrs;
    } else {
      throw new Error(`${key} does not own any WDR`);
    }
  }

  
  async viewAllUsersWithAddAccess(ctx, userEmail) {
    
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    
    if (userAsBytes.length === 0) {
      throw new Error(`${key} does not exist`);
    }

    const user = User.deserialize(JSON.parse(userAsBytes.toString()));
    const adderUserList = user.getaddedUserList();

    if (adderUserList.length > 0) {
      const resPermittedUserList = [];
      for (let i = 0; i < adderUserList.length; i++) {
        const userKey = ctx.stub.createCompositeKey("User", [adderUserList[i]]);
        const userKeyrAsBytes = await ctx.stub.getState(userKey);
        const perUser = User.deserialize(
          JSON.parse(userKeyrAsBytes.toString())
        );
        resPermittedUserList.push([
          perUser.getName(),
          perUser.getEmail(),
          perUser.getType(),
        ]);
      }
      return resPermittedUserList;
    } else {
      throw new Error(`${key} didn't grant access to any doctor`);
    }
  }
  
  async getGrantedUserForWDR(ctx, wdrID, userEmail) {
    const key = ctx.stub.createCompositeKey("WDR", [wdrID]);
    const wdrAsBytes = await ctx.stub.getState(key);
    
    if (wdrAsBytes.length === 0) {
      throw new Error(`WDR with ID: ${wdrID} does not exist`);
    }

    let key2 = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key2);
    
    if (userAsBytes.length === 0) {
      console.info("Here is an error");
      
      throw new Error(`User with ID: ${email} doesn't exist`);
    }

    const wdr = WDR.deserialize(JSON.parse(wdrAsBytes.toString()));
    const permittedList = wdr.getPermittedList();

    if (wdr.getRecordOwner() === userEmail) {
      if (permittedList.length > 0) {
        const resPermittedUserList = [];
        for (let i = 0; i < permittedList.length; i++) {
          const userKey = ctx.stub.createCompositeKey("User", [
            permittedList[i],
          ]);
          const userKeyrAsBytes = await ctx.stub.getState(userKey);
          const perUser = User.deserialize(
            JSON.parse(userKeyrAsBytes.toString())
          );
          resPermittedUserList.push([
            perUser.getName(),
            perUser.getEmail(),
            perUser.getType(),
          ]);
        }
        return resPermittedUserList;
      } else {
        throw new Error(
          ` WDR ${wdrID} doesn't have access permission any users.`
        );
      }
    } else {
      throw new Error(
        `User with ID: ${userEmail} doesn't own WDR with ID: ${wdrID}`
      );
    }
  }

  async grantViewAccess(ctx, userEmail, viewerEmail, wdrID) {
    
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    
    if (userAsBytes.length === 0) {
      throw new Error(`User with ID: ${userEmail} does not exist`);
    }

    const key2 = ctx.stub.createCompositeKey("User", [viewerEmail]);
    const userAsBytes2 = await ctx.stub.getState(key2);
    
    if (userAsBytes2.length === 0) {
      throw new Error(`User with ID: ${viewerEmail} does not exist`);
    }
    
    const wdrKey = ctx.stub.createCompositeKey("WDR", [wdrID]);
    const wdrAsBytes = await ctx.stub.getState(wdrKey);

    if (wdrAsBytes.length === 0) {
      throw new Error(`WDR with ID: ${wdrID} does not exist`);
    }
    const wdr = WDR.deserialize(JSON.parse(wdrAsBytes.toString()));
    
    if (wdr.getRecordOwner() === userEmail) {
      if (wdr.checkUserInPermittedList(viewerEmail) === false) {
        wdr.permittedList.push(viewerEmail);
        await ctx.stub.putState(wdrKey, Buffer.from(JSON.stringify(wdr)));
        return `User with ID: ${viewerEmail} has been successfully given view access of WDR with ID: ${wdrID}`;
      } else {
        return `User with ID: ${viewerEmail} already has view access`;
      }
    } else {
      throw new Error(
        `User with ID: ${userEmail} doesn't own WDR with ID: ${wdrID}`
      );
    }
  }

  async revokeViewAccess(ctx, userEmail, viewerEmail, wdrID) {
    
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    
    if (userAsBytes.length === 0) {
      throw new Error(`User with ID: ${userEmail} does not exist`);
    }

    const key2 = ctx.stub.createCompositeKey("User", [viewerEmail]);
    const userAsBytes2 = await ctx.stub.getState(key2);
    
    if (userAsBytes2.length === 0) {
      throw new Error(`User with ID: ${viewerEmail} does not exist`);
    }
    
    const wdrKey = ctx.stub.createCompositeKey("WDR", [wdrID]);
    const wdrAsBytes = await ctx.stub.getState(wdrKey);

    if (wdrAsBytes.length === 0) {
      throw new Error(`WDR with ID: ${wdrID} does not exist`);
    }
    const wdr = WDR.deserialize(JSON.parse(wdrAsBytes.toString()));
    
    if (wdr.getRecordOwner() === userEmail) {
      if (wdr.checkUserInPermittedList(viewerEmail) === true) {
        let pos = wdr.permittedList.indexOf(viewerEmail);
        wdr.permittedList.splice(pos, 1);
        await ctx.stub.putState(wdrKey, Buffer.from(JSON.stringify(wdr)));
        return ` View access of WDR with ID: ${wdrID} has been successfully removed from user with ID: ${viewerEmail}`;
      } else {
        return `User with ID: ${viewerEmail} doesn't have view access yet`;
      }
    } else {
      throw new Error(
        `User with ID: ${userEmail} doesn't own WDR with ID: ${wdrID}`
      );
    }
  }

  async grantAddAccess(ctx, userEmail, adderEmail) {
    
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    const adderKey = ctx.stub.createCompositeKey("User", [adderEmail]);
    const adderAsBytes = await ctx.stub.getState(adderKey);
    
    if (userAsBytes.length === 0) {
      throw new Error(`$User with ID: ${userEmail} does not exist`);
    } else if (adderAsBytes.length === 0) {
      throw new Error(`User with ID: ${adderEmail} does not exist`);
    } else {
      let user = User.deserialize(JSON.parse(userAsBytes.toString()));
      
      if (user.checkPermissionForUser(adderEmail) === false) {
        user.addedUserList.push(adderEmail);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
        
        return `User with ID: ${adderEmail} successfully given permission to add WDR for user with ID: ${userEmail}`;
      } else {
        return `User with ID: ${adderEmail} already in adder list`;
      }
    }
  }

  async revokeAddAccess(ctx, userEmail, adderEmail) {
    
    const userKey = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(userKey);
    
    const adderKey = ctx.stub.createCompositeKey("User", [adderEmail]);
    const adderAsBytes = await ctx.stub.getState(adderKey);
    
    if (userAsBytes.length === 0) {
      throw new Error(`$User with ID: ${userEmail} does not exist`);
    } else if (adderAsBytes.length === 0) {
      throw new Error(`User with ID: ${adderEmail} does not exist`);
    } else {
      const user = User.deserialize(JSON.parse(userAsBytes.toString()));
      
      if (user.checkPermissionForUser(adderEmail) === true) {
        let pos = user.addedUserList.indexOf(adderEmail);
        user.addedUserList.splice(pos, 1);
        await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
        return `Permission successfully removed from user with ID: ${adderEmail} to add WDR for user with ID: ${userEmail}`;
      }
      return `$User with ${adderEmail} is yet to be in adder list!`;
    }
  }
}

module.exports = WDRContract;
