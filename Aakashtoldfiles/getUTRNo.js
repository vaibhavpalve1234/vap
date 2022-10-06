const rdbFireStoreInstance = require("../../../../functions/helper/fireStore");
const {  updateSheetData } = require("./gsheet");

const userCollectionData = async() =>{
    const data = await rdbFireStoreInstance.collection('ArthmateDisbursement').get();
    data.forEach((doc) => {
        const {loanId,type,status,txn_id, } = doc.data();
        console.log(loanId, type, status, txn_id);
      });
      
      await updateSheetData()
}
userCollectionData()
// import { asyncForEach } from "../../../../functions/util/asyncForEach";
// import {
//   getAllTransactionByLoanId,
//   getLoanInformation,
// } from "../../../../functions/util/fetchInfoFromDB";

// export const getStatusDebitCredit = async (req, res) => {
//   try {
//     const { loandId } = req.body;
//     let debit = [];
//     let repaid = [];
//     if (!Array.isArray(loandId)) {
//       return res.send("invalid ");
//     }
//     await asyncForEach(loandId, async (loanID) => {
//       const data = await getLoanInformation(loanID);
//       const userIdentifier = loanID.split(/[_ ]+/).pop();
//       const transactions = await getAllTransactionByLoanId(
//         userIdentifier,
//         loanID
//       );
//       if(!transactions){ 
//         return
//       }
//       let allTransactionsfromLoan = Object.keys(transactions) || [] ;
//       await asyncForEach(allTransactionsfromLoan, (transaction) => {
//         if (transactions[transaction].type == "DEBIT") {
//           debit.push([transaction, transactions[transaction].txn_id]);
//         }
//         if (
//           transaction.loanId == loanID ||
//           transactions[transaction].type == "REPAID"
//         ) {
//           repaid.push([transaction, transactions[transaction].txn_id]);
//         }
//       });
//     });
//     res.status(200).send({
//       debit,
//       repaid,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
