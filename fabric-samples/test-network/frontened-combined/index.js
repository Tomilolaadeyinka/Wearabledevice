// Combined index.js

$(document).ready(function () {
  // Patient
  $("#grantViewB").click(grantViewAccess);
  $("#revokeViewB").click(revokeViewAccess);
  $("#grantAddB").click(grantAddAccess);
  $("#revokeAddB").click(revokeAddAccess);
  $("#viewWDRFPatient").submit(getWDR);

  $("#viewWDRList").submit(viewAllWDR);
  $("#viewAddAccessList1").submit(viewAddAccessList);
  $("#viewUserForWDR").submit(viewAllUserForWDR);

  // Admin
  $("#addUserF").submit(addUser);

  // Doctor
  $("#addWDRFDoctor").submit(addWDRDoctor);
  $("#viewWDRF").submit(getWDRDoctor);

  // Lab
  $("#addWDRF").submit(addWDRLab);
});

// Patient functions
const grantViewAccess = function (event) {
  event.preventDefault();

  const formData = $("#viewAccessF").serializeArray();
  const userEmail = formData[0].value;
  const viewerEmail = formData[1].value;
  const wdrID = formData[2].value;
  $.ajax({
    url: "http://localhost:3000/patient/grantViewAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      viewerEmail: viewerEmail,
      wdrID: wdrID,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#wdrdata').val(resData);
        // $('#wdrdata').display("inline");
        // $('#wdrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#viewAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
  // $.ajax({
  //     url: 'http://localhost:3000/unsold',
  //     method: 'GET',
  //     accepts: "application/json",
  //     success: function(data) {
  //         populateUnsoldProducts(data);
  //     },
  //     error: function(error) {
  //         alert(JSON.stringify(error));
  //     }
  // });
};

const revokeViewAccess = function (event) {
  event.preventDefault();

  const formData = $("#viewAccessF").serializeArray();
  const userEmail = formData[0].value;
  const viewerEmail = formData[1].value;
  const wdrID = formData[2].value;
  console.log(formData);
  $.ajax({
    url: "http://localhost:3000/patient/revokeViewAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      viewerEmail: viewerEmail,
      wdrID: wdrID,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#wdrdata').val(resData);
        // $('#wdrdata').display("inline");
        // $('#wdrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#viewAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const grantAddAccess = function (event) {
  event.preventDefault();

  const formData = $("#addAccessF").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;
  $.ajax({
    url: "http://localhost:3000/patient/grantAddAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#wdrdata').val(resData);
        // $('#wdrdata').display("inline");
        // $('#wdrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const revokeAddAccess = function (event) {
  event.preventDefault();

  const formData = $("#addAccessF").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;
  console.log(formData);
  $.ajax({
    url: "http://localhost:3000/patient/revokeAddAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#wdrdata').val(resData);
        // $('#wdrdata').display("inline");
        // $('#wdrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addAccessF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const getWDR = function (event) {
  event.preventDefault();

  const formData = $("#viewWDRFPatient").serializeArray();
  console.log(formData);
  const userEmail = formData[0].value;
  const wdrID = formData[1].value;

  $.ajax({
    url: "http://localhost:3000/patient/getWDR",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      wdrID: wdrID,
    }),
    contentType: "application/json",
    success: function (resData) {
      // alert(resData);
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#wdrdata").css("display", "none");
      } else {
        $("#wdrdata").val(resData);
        // $('#wdrdata').display("inline");
        $("#wdrdata").css("display", "inline");
      }

      // appendProduct(JSON.parse(data));
    },
    error: function (error) {
      //alert(error);
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const viewAllWDR = function (event) {
  event.preventDefault();
  console.log(" viewAllWDR sending ...");
  const formData = $("#viewWDRList").serializeArray();
  console.log(formData);
  const userEmail = formData[0].value;

  $.ajax({
    url: "http://localhost:3000/patient/viewAllWDR",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      resData = JSON.parse(resData);
      if (resData.toString().indexOf("Error:") != -1) {
        swal("Oops", resData, "error");
      } else {
        createTable(resData, "viewALlWDR");
      }

      // appendProduct(JSON.parse(data));
    },
    error: function (error) {
      //alert(error);
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const viewAddAccessList = function (event) {
  event.preventDefault();
  console.log(" viewAddAccessList sending ...");
  const formData = $("#viewAddAccessList1").serializeArray();
  console.log(formData);
  const userEmail = formData[0].value;

  $.ajax({
    url: "http://localhost:3000/patient/viewAllUsersWithAddAccess",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      // alert(resData);
      resData = JSON.parse(resData);
      console.log(" viewAddAccessList result ::" + resData);
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#wdrdataviewAddAccessListDiv").css("display", "none");
      } else {
        $("#wdrdataviewAddAccessListDiv").val(resData);
        // $('#wdrdata').display("inline");
        $("#wdrdataviewAddAccessListDiv").css("display", "inline");
        createTable(resData, "viewAddAccessList");
      }

      // appendProduct(JSON.parse(data));
    },
    error: function (error) {
      //alert(error);
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

const viewAllUserForWDR = function (event) {
  event.preventDefault();
  console.log(" viewAllUserForWDR sending ...");
  const formData = $("#viewUserForWDR").serializeArray();
  console.log(formData);
  const userEmail = formData[0].value;
  const wdrID = formData[1].value;

  $.ajax({
    url: "http://localhost:3000/patient/getGrantedUserForWDR",
    method: "POST",
    data: JSON.stringify({
      wdrID: wdrID,
      userEmail: userEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      // alert(resData);
      resData = JSON.parse(resData);
      console.log(" viewAllUserForWDR result ::" + resData);
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#wdrdataviewUserForWDRDiv").css("display", "none");
      } else {
        $("#wdrdataviewUserForWDRDiv").val(resData);
        // $('#wdrdata').display("inline");
        $("#wdrdataviewUserForWDRDiv").css("display", "inline");
        createTable(resData, "viewAllUserForWDR");
      }

      // appendProduct(JSON.parse(data));
    },
    error: function (error) {
      //alert(error);
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

function createTable(data, type) {
  if (type == "viewALlWDR") {
    var tableBody = document.querySelector("#viewAllWDRList tbody");
  }
  if (type == "viewAddAccessList") {
    var tableBody = document.querySelector("#viewAddAccessList tbody");
  }
  if (type == "viewAllUserForWDR") {
    var tableBody = document.querySelector("#viewAllUserForWDR tbody");
  }

  // Clear existing rows
  tableBody.innerHTML = "";
  console.log(typeof data);
  // p01@gmail.com
  // [["d01@gmail.com","medical","This is 1","26/11/2023",1],["d01@gmail.com","medical","This is 2","26/11/2023",1],["d01@gmail.com","medical","This is 3","26/11/2023",1]]

  // Iterate through each row in the array
  // data.forEach((row) => {
  //   console.log(row);
  //   var tableRow = document.createElement("tr");

  //   // Iterate through each column in the row
  //   row.forEach(function (col) {
  //     var tableCell = document.createElement("td");
  //     tableCell.textContent = col;
  //     tableRow.appendChild(tableCell);
  //   });

  //   // Append the row to the table body
  //   tableBody.appendChild(tableRow);
  // });

  // Write the above loop in another way
  for (var i = 0; i < data.length; i++) {
    var tableRow = document.createElement("tr");

    for (var j = 0; j < data[i].length; j++) {
      var tableCell = document.createElement("td");
      console.log(data[0]);
      tableCell.textContent = data[i][j];
      tableRow.appendChild(tableCell);
    }

    tableBody.appendChild(tableRow);
  }
}

// Admin functions
const addUser = function (event) {
  event.preventDefault();

  const formData = $("#addUserF").serializeArray();
  const name = formData[0].value;
  const email = formData[1].value;
  const type = formData[2].value;

  $.ajax({
    url: "http://localhost:3001/admin/addEntityUser",
    method: "POST",
    data: JSON.stringify({
      name: name,
      email: email,
      type: type,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#wdrdata').val(resData);
        // $('#wdrdata').display("inline");
        // $('#wdrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addUserF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

// Doctor functions
const addWDRDoctor = function (event) {
  event.preventDefault();

  const formData = $("#addWDRFDoctor").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;
  const wdrID = formData[2].value;
  const type = "medical";
  const content = formData[3].value;

  $.ajax({
    url: "http://localhost:3002/doctor/addWDR",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
      wdrID: wdrID,
      type: type,
      content: content,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
      } else {
        // $('#wdrdata').val(resData);
        // $('#wdrdata').display("inline");
        // $('#wdrdata').css('display', 'inline');
        swal("Success", resData, "success");
        $("#addWDRF").trigger("reset");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

// async getWDR(ctx, wdrID, email)
const getWDRDoctor = function (event) {
  event.preventDefault();

  const formData = $("#viewWDRF").serializeArray();
  console.log(formData);
  const wdrID = formData[0].value;
  const userEmail = formData[1].value;

  $.ajax({
    url: "http://localhost:3002/doctor/getWDR",
    method: "POST",
    data: JSON.stringify({
      wdrID: wdrID,
      userEmail: userEmail,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#wdrdataDoctor").css("display", "none");
      } else {
        $("#wdrdataDoctor").val(resData);
        // $('#wdrdata').display("inline");
        $("#wdrdataDoctor").css("display", "inline");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};

// Lab functions
const addWDRLab = function (event) {
  event.preventDefault();

  const formData = $("#addWDRF").serializeArray();
  const userEmail = formData[0].value;
  const adderEmail = formData[1].value;
  const wdrID = formData[2].value;
  const type = "test";
  const content = formData[3].value;

  $.ajax({
    url: "http://localhost:3003/lab/addWDR",
    method: "POST",
    data: JSON.stringify({
      userEmail: userEmail,
      adderEmail: adderEmail,
      wdrID: wdrID,
      type: type,
      content: content,
    }),
    contentType: "application/json",
    success: function (resData) {
      if (resData.toString().indexOf("Error:") != -1) {
        //alert(resData);
        swal("Oops", resData, "error");
        $("#addWDRF").trigger("reset");
      } else {
        // $('#wdrdata').val(resData);
        // $('#wdrdata').display("inline");
        // $('#wdrdata').css('display', 'inline');
        swal("Success", resData, "success");
      }
    },
    error: function (error) {
      swal("Oops", error.toString(), "error");
      console.log(error);
    },
  });
};
