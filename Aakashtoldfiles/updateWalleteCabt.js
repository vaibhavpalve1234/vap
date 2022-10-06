const { asyncForEach } = require("../../../../functions/util/asyncForEach");
const {
  getUserInformation,
  insertIntoDatabase,
} = require("../../../../functions/util/fetchInfoFromDB");
const { handleData } = require("../../../../functions/util/handleData");
let csv = require("csvtojson");
const generateLoan = require("../../../../functions/loans/generateLoan");

const updatedUserWalletBalance = async () => {
  let userIdentifiers = [];
  let balance = [];
  await asyncForEach(userIdentifiers, async (userIdentifier, i) => {
    let data1 = await getUserInformation(userIdentifier);
    let { workProfile, Loan } = data1 || {};
    if (!Loan) {
      console.log(userIdentifier);
      return;
    }
    let data = {
      account_holder_name: "",
      account_number: "",
      actual_vendor_name: "Test Vendor - Cabt",
      advance_provided: 0,
      bank_name: "",
      calculated_value: 1800,
      capacity: "1",
      category_id: "b5e61985-050f-47e8-b87a-297d3e68f7fe",
      cod_pending: 0,
      deliveryper: "0",
      driver_number: userIdentifier,
      hardship_allowance: 0,
      hours: 11,
      hub_name: "Flipkart - Hyperlocal - Grocery",
      ifsc_code: "",
      incentives: 0,
      invoice_value: 1700,
      invoice_value_2: 100,
      kilometers: "120.000",
      lm_percentage: "0",
      marked: "0",
      pricing_applicable: "Testing_Rate",
      rate_list_id: "e716cb97-b178-4180-814d-6190b33fc67b",
      rider_active: "",
      rider_id: "",
      route_code: "Ecomm",
      runsheet_id: `VAlyu26Spet-${userIdentifier}`,
      tonnage: 950,
      total_ofd_orders: 0,
      total_payable: balance[i],
      touch_points: 20,
      trip_date: "2022-02-24",
      vehicle_active: false,
      vehicle_type: "Ecomm",
      vendor_id: "05f58f54-079b-4b82-8526-163b0f79c6eb",
    };
    console.log(data);
    // let { result, error } = await handleData(
    //   "https://api.valyu.ai/client/cabit/updateWalletBalance",
    //   data,
    //   {
    //     headers: {
    //       "api-key": "89IoWv8QqRQfF8TOliGZC",
    //     },
    //   }
    // );
    // generateLoan([
    //   { "userIdentifier": userIdentifier, "amount": balance[i] }
    // ])
  
    console.log(result.data.message, error);
  });
};
updatedUserWalletBalance();
