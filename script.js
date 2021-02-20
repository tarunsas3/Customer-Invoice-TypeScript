var customerArrList = [];
var accountArrList = [];
var invoiceArrList = [];

var Customer = /** @class */ (function () {
  function Customer(ID, name, discount) {
    this.ID = ID;
    this.name = name;
    this.discount = discount;
  }
  Customer.prototype.getID = function () {
    return this.ID;
  };
  Customer.prototype.getName = function () {
    return this.name;
  };
  Customer.prototype.getDiscount = function () {
    return this.discount;
  };
  Customer.prototype.setDiscount = function (discount) {
    this.discount = discount;
  };
  return Customer;
})();
var Invoice = /** @class */ (function () {
  function Invoice(id, customer, amount, details) {
    this.ID = id;
    this.customer = customer;
    this.details = details;
    this.amount = amount;
  }
  Invoice.prototype.getID = function () {
    return this.ID;
  };
  Invoice.prototype.getCustomer = function () {
    return this.customer;
  };
  Invoice.prototype.setCustomer = function (customer) {
    this.customer = customer;
  };
  Invoice.prototype.getAmount = function () {
    return this.amount;
  };
  Invoice.prototype.setAmount = function (amount) {
    this.amount = amount;
  };
  Invoice.prototype.getCustomerName = function () {
    return this.customer.name;
  };
  Invoice.prototype.getAmountAfterDiscount = function () {
    return +(
      this.amount -
      (this.amount * this.customer.getDiscount()) / 100
    ).toFixed(2);
  };
  return Invoice;
})();
var Account = /** @class */ (function () {
  function Account(id, customer, balance) {
    this.balance = 0.0;
    this.ID = id;
    this.customer = customer;
    if (balance !== undefined) this.balance = balance;
  }
  Account.prototype.getID = function () {
    return this.ID;
  };
  Account.prototype.getCustomer = function () {
    return this.customer;
  };
  Account.prototype.getBalance = function () {
    return this.balance;
  };
  Account.prototype.setBalance = function (balance) {
    this.balance = +balance.toFixed(2);
  };
  Account.prototype.toString = function () {
    return (
      this.getCustomerName() + "(" + this.ID + ") balance=Rs." + this.balance
    );
  };
  Account.prototype.getCustomerName = function () {
    return this.customer.getName();
  };
  Account.prototype.deposit = function (amount) {
    this.balance += amount;
    return this;
  };
  Account.prototype.withdraw = function (amount) {
    if (this.balance >= amount) {
      this.balance -= amount;
      return true;
    } else {
      return false;
    }
  };
  return Account;
})();
document
  .getElementById("addCustomer-btn")
  .addEventListener("click", function () {
    var cId = +document.getElementById("customerID").value;
    var cName = document.getElementById("customerName").value.trim();
    var discount = +document.getElementById("discount").value;
    var newcus = customerArrList.filter(function (element) {
      return element.ID == cId;
    });
    if (newcus.length > 0) {
      alert("CustomerId exist kindly change the Id");
      return false;
    }
    if (cName !== "" && discount >= 0) {
      var customer = new Customer(cId, cName, discount);
      customerArrList.push(customer);
      document.getElementById("customerName").value = "";
      document.getElementById("discount").value = "";
      document.getElementById("customerID").value = "";
      updateCustomerSelectList();
      var cAccount = new Account(cId, customer);
      console.log(customerArrList, cAccount);
      accountArrList.push(cAccount);
    }
  });
document.getElementById("deposit").addEventListener("click", function () {
  var customerID = +document.getElementById("walletCustomerList").value;
  var amount = +document.getElementById("walletAmount").value;
  if (customerID !== NaN && amount != 0) {
    var customer = void 0;
    var details = "Amount Deposit";
    for (var i in accountArrList) {
      if (accountArrList[i].customer.ID == customerID) {
        customer = accountArrList[i].customer;
        accountArrList[i].deposit(amount);
        alert("Amount Deposited. " + accountArrList[i].toString());
      }
    }
    var gCheck = document.getElementById("generateInvoice").checked;
    if (gCheck) {
      var depositInvoice = new Invoice(
        invoiceArrList.length + 1,
        customer,
        amount,
        details
      );
      invoiceArrList.push(depositInvoice);
      generateInvoice(depositInvoice);
    }
    document.getElementById("walletCustomerList").options[0].selected = true;
    document.getElementById("walletAmount").value = "";
  }
});
document.getElementById("withdraw").addEventListener("click", function () {
  var customerID = +document.getElementById("walletCustomerList").value;
  var amount = +document.getElementById("walletAmount").value;
  if (customerID !== NaN && amount != 0) {
    var customer = void 0;
    var details = "Amount withdrawed";
    var wCheck = void 0;
    for (var i in accountArrList) {
      if (accountArrList[i].customer.ID == customerID) {
        customer = accountArrList[i].customer;
        wCheck = accountArrList[i].withdraw(amount);
        if (wCheck) {
          alert("Amount withdrawed. " + accountArrList[i].toString());
        } else {
          alert("Withdrawl amount Exceeds balance. Try again!");
        }
      }
    }
    var gCheck = document.getElementById("generateInvoice").checked;
    if (gCheck && wCheck) {
      var withdrawlInvoice = new Invoice(
        invoiceArrList.length + 1,
        customer,
        amount,
        details
      );
      invoiceArrList.push(withdrawlInvoice);
      generateInvoice(withdrawlInvoice);
    }
    document.getElementById("walletCustomerList").options[0].selected = true;
    document.getElementById("walletAmount").value = "";
  }
});
document
  .getElementById("displayModal-btn")
  .addEventListener("click", function () {
    var customerID = +document.getElementById("purchaseCustomerList").value;
    var amount = +document.getElementById("purchaseAmount").value;
    if (customerID === NaN || amount == 0) {
      document.getElementById("purchaseConfirm").innerText = "Invalid Data";
      return;
    }
    var customerAccount;
    console.log(customerAccount);
    var details = "Purchase";
    for (var i in accountArrList) {
      if (accountArrList[i].customer.ID == customerID) {
        customerAccount = accountArrList[i];
      }
    }
    var discountAmount = +(
      (customerAccount.getCustomer().getDiscount() * amount) /
      100
    ).toFixed(2);
    var afterDiscount = amount - discountAmount;
    document.getElementById("purchaseConfirm").innerText =
      "Amount : " +
      amount +
      "\n         Discount : " +
      discountAmount +
      "\n         Amount after Discount : " +
      afterDiscount +
      " ";
  });
document.getElementById("purchase-btn").addEventListener("click", function () {
  var customerID = +document.getElementById("purchaseCustomerList").value;
  var amount = +document.getElementById("purchaseAmount").value;
  if (customerID === NaN || amount == 0) return;
  var customerAccount;
  var details = "Purchase";
  for (var i in accountArrList) {
    if (accountArrList[i].customer.ID == customerID) {
      customerAccount = accountArrList[i];
    }
  }
  var invoice = new Invoice(
    invoiceArrList.length + 1,
    customerAccount.getCustomer(),
    amount,
    details
  );
  if (customerAccount.getBalance() >= invoice.getAmountAfterDiscount()) {
    customerAccount.setBalance(
      customerAccount.getBalance() - invoice.getAmountAfterDiscount()
    );
    invoiceArrList.push(invoice);
    generateInvoice(invoice);
    alert("Purchase Successful!!");
  } else {
    alert("Balance is low. Deposit Amount to make purchase.");
  }
  document.getElementById("purchaseCustomerList").options[0].selected = true;
  document.getElementById("purchaseAmount").value = "";
});
var updateCustomerSelectList = function () {
  var purchaseSelect = document.getElementById("purchaseCustomerList");
  purchaseSelect.innerHTML = "";
  var walletSelect = document.getElementById("walletCustomerList");
  walletSelect.innerHTML = "";
  var selectedOption = document.createElement("option");
  selectedOption.selected = true;
  selectedOption.innerHTML = "Select...";
  walletSelect.append(selectedOption);
  selectedOption = document.createElement("option");
  selectedOption.selected = true;
  selectedOption.innerHTML = "Select...";
  purchaseSelect.append(selectedOption);
  for (var i in customerArrList) {
    var option = document.createElement("option");
    option.value = customerArrList[i].getID().toString();
    option.innerHTML = customerArrList[i].getName();
    option.selected = false;
    purchaseSelect.append(option);
    option = document.createElement("option");
    option.value = customerArrList[i].getID().toString();
    option.innerHTML = customerArrList[i].getName();
    option.selected = false;
    walletSelect.append(option);
  }
};
var generateInvoice = function (invoice) {
  var tableContainer = document.getElementById("invoiceTable");
  if (tableContainer.childElementCount == 0) {
    var table = document.createElement("table");
    table.setAttribute("class", "table table-hover");
    var tableHead = document.createElement("thead");
    tableHead.setAttribute("class", "thead-dark");
    var tableBody = document.createElement("tbody");
    tableBody.id = "tableBody";
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.innerHTML = "Invoice no.";
    tr.append(th);
    var th = document.createElement("th");
    th.innerHTML = "Customer ID";
    tr.append(th);
    var th = document.createElement("th");
    th.innerHTML = "Customer Name";
    tr.append(th);
    var th = document.createElement("th");
    th.innerHTML = "Details";
    tr.append(th);
    var th = document.createElement("th");
    th.innerHTML = "Amount";
    tr.append(th);
    var th = document.createElement("th");
    th.innerHTML = "After Discount";
    tr.append(th);
    tableHead.append(tr);
    table.append(tableHead, tableBody);
    tableContainer.append(table);
  }
  console.log(invoice.customer.ID);
  var ouputTableBody = document.getElementById("tableBody");
  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.innerHTML = invoiceArrList.length.toString();
  tr.append(td);
  var td = document.createElement("td");
  td.innerHTML = "" + invoice.customer.ID;
  tr.append(td);
  td = document.createElement("td");
  td.innerHTML = invoice.getCustomerName();
  tr.append(td);
  td = document.createElement("td");
  td.innerHTML = invoice.details;
  tr.append(td);
  td = document.createElement("td");
  td.innerHTML = "Rs." + invoice.getAmount();
  tr.append(td);
  td = document.createElement("td");
  if (invoice.details === "Purchase")
    td.innerHTML = "Rs." + invoice.getAmountAfterDiscount();
  else td.innerHTML = "-";
  tr.append(td);
  ouputTableBody.append(tr);
};
