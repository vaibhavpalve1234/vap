const functions = require("firebase-functions");
const fs = require("fs");
const rdbFireStoreInstance = require("../../../../functions/helper/fireStore");
const LoanDisbursment = require("../../../../functions/models/loanDisbursment");
const { asyncForEach } = require("../../../../functions/util/asyncForEach");
const getUserLoan = async (LoanId) => {
  let userLoanData;
  let val=0
  const data = await rdbFireStoreInstance
    .collection("/ArthmateDisbursement/")
    .doc(LoanId)
    .get();
  if (data.data()) {
    let { loanId,
        am_loan_id,
        am_line_id,
        uuid,
        partner_user_id,
        amount,
        disbursement_amount,
        disbursmentAmount,
        repaymentAmount,
        date_and_time_stamp,
        remarks,
        utr,
        txn_date,
        partner_line_id,
        status,
        firstEmiDate} = data.data();
    let check=0
    let checkLoanDisbursment=await LoanDisbursment.query().select().where("loan_id",loanId).first()
    if(!checkLoanDisbursment)
    {
        await LoanDisbursment.query().insert({
            loan_id: loanId,
            nbfc_loan_id: am_loan_id,
            nbfc_line_id: am_line_id,
            valyu_line_id: partner_line_id,
            valyu_user_id: partner_user_id,
            disbursment_time: date_and_time_stamp,
            actual_disbursment_amount: disbursement_amount,
            message: 'Received Disbursment Confirmation from Arthmate',
            remarks,
            status: 'Success',
            nbfc_uuid: uuid,
            utr,
          });
    }
    userLoanData = {
      loanId,
      utr,
      status,
      check
    };
  }
  return userLoanData;
};
async function populate() {
  let data = []
  let data1 = [];
  await asyncForEach(data, async (e) => {
    let usrData = await getUserLoan(e);
    if (!usrData) {
      console.log("not fountd");
    } else {
      data1.push(usrData);
    }
  });
  var data2 = "";
  let count=0;
  for (var i = 0; i < data1.length; i++) {
    if(data1[i].check==1)
    {
     count=count+1
    }
    data2 =
      data2 +
      data1[i].loanId +
      "\t" +
      data1[i].utr +
      "\t" +
      data1[i].check +
      "\t" +
      data1[i].status +
      "\n";
  }
  console.log(count)
  fs.writeFileSync("Filename.xls", data2, (err) => {
    if (err) throw err;
    console.log("File created");
  });
}

populate();
