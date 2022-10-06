const {
    getUserInformation,
    updateIntoDatabase,
    getClientInformation,
  } = require('../util/fetchInfoFromDB');
  const { handleData } = require('../util/handleData');
  const {
    arthmateInstantDisbursment,
    arthmateCredential,
  } = require('../config/index.config');
  const moment = require('moment');
  const { getSignedUrlforDocument } = require('../util/generateLink');
  const { momentInstanceToFormat, momentInstance } = require('../helper/moment');
  const storageInstance = require('../helper/storage');
  const { htmlToPdf } = require('../util/generatePdf');
  const { asyncForEach } = require('../util/asyncForEach');
  const {
    userLineCreation: { url, options },
  } = arthmateInstantDisbursment;
  
  const updateUSerLineID = async (userIdentifier) => {
    let result,
      error,
      status = false;
    try {
      const buffer = Buffer.from(arthmateCredential);
      const encodedString = buffer.toString('base64');
      let userData = await getUserInformation(userIdentifier);
      let now = momentInstance.format('MMM DD YYYY h:mm A');
      let {
        workProfile,
        personal: { panNumber, aadharNumber },
        Loan,
        userProfile: {
          user_id,
          firstName,
          lastName,
          dob,
          gender,
          address1,
          address2,
          matrialStatus,
          pinCode,
          city,
          state,
        },
      } = userData;
      if (!Loan) {
        return;
      }
      let firstLoanId = Object.keys(Loan)[0];
      let loan = Loan[firstLoanId];
      let {
        repaymentAmount,
        amount,
        reason,
        loan_tenure_in_days,
        interestRate,
        firstEmiDate,
        platformFees,
        processingFees,
      } = loan;
      let employerName = Object.keys(workProfile)[0];
      let { userData: userWorkProfileData, account } = workProfile[employerName];
      let { bankAcNo, bankName, ifscCode } = account;
  
      let {
        creditLineId,
        creditLimit,
        arthmateUuid,
        arthmate_line_id,
        arthmate,
        emailId,
        officeAddress,
      } = userWorkProfileData;
  
      // Create new Loan Document
      let startDate = momentInstance.format('YYYY-MM-DD');
      let loanStartDate = moment(startDate, 'YYYY-MM-DD').format('MMM DD,YYYY');
  
      let birthDate = moment(dob, 'YYYY-MM-DD').format('MMM DD,YYYY');
      let employer_data = await getClientInformation(employerName);
      let { clientName, defaultProductName } = employer_data;
      let { agreementHtmlPath } = employer_data[defaultProductName];
  
      let applicationformData = {
        LENDER_NAME: 'Mamta Projects Pvt. Ltd.',
        NAME_OF_BORROWER: `${firstName} ${lastName}`,
        PAN_OF_BORROWER: panNumber,
        DOB_OF_BORROWER: birthDate,
        AADHAR_OF_BORROWER: aadharNumber,
        CONTACT_OF_BORROWER: userIdentifier,
        MARITAL_STATUS_OF_BORROWER: matrialStatus,
        EMAIL_ID_OF_BORROWER: emailId,
        GENDER_OF_BORROWER: gender,
        LOAN_ADDRESS: officeAddress,
        LANDMARK_ADDRESS: address1 + '' + address2,
        LANDMARK_PINCODE: pinCode,
        LANDMARK_CITY: city,
        LANDMARK_STATE: state.value,
        LOAN_AMOUNT: repaymentAmount,
        ACTUAL_AMOUNT: Number(amount).toFixed(2),
        PURPOSE_OF_LOAN: reason,
        LOAN_TENURE: loan_tenure_in_days,
        LOAN_BANK_NAME: bankName,
        LOAN_BANK_ACCOUNT: bankAcNo,
        LOAN_BANK_IFSC: ifscCode,
        LOAN_PRODUCT_NAME: 'Valyu – Credit Line Subscription',
        LOAN_DUE_DATE: firstEmiDate,
        LOAN_RATE_OF_INTEREST: interestRate + '%',
        INTEREST_METHOD: 'Daily Interest',
        TIMESTAMP: now,
        LOAN_ID: firstLoanId,
        LOAN_DATE: loanStartDate,
        //EDI_date
        LOAN_TOTAL_AMOUNT: repaymentAmount,
        LOAN_MOBILE_NUMBER: userData,
        LOAN_AGREEMENT_NO: firstLoanId,
        // PROCESSING_FEES: processing_fee,
        PARTNER_FEE: (processingFees + platformFees).toFixed(2),
        //Bussiness of borrower
        STAMPING_CHARGES: 0,
        PLATFORM_FEES: platformFees,
        LATE_PAYMENT_CHARGES: 0,
        PREPAYMENT_CHARGES: 0,
        LEGAL_CHARGES: 0,
        CLIENTNAME: clientName,
        NUMBER_OF_EDI: 1,
        PAYMENT_MODE: 'Online',
        LOAN_RATE_OF_INTEREST_PER_ANNUM: 0,
        LOAN_USER_LOCATION: '----',
        BUSINESS_PHONE: 'BUSINESS_PHONE',
        ELIGIBILITY_AMOUNT: 1000000,
        TENURE: '45 days',
      };
      let unixStamp = moment().unix();
      let { isPdfgenerated, path: pdfPath } = await htmlToPdf(
        `${firstLoanId}_${unixStamp}`,
        applicationformData,
        agreementHtmlPath,
        userIdentifier,
        employer_data
      );
      let loanDocument;
  
      if (isPdfgenerated) {
        await storageInstance.upload(pdfPath, {
          destination: `loanDocuments/${userIdentifier}/${firstLoanId}_${unixStamp}.pdf`,
        });
  
        let loan_document_url = `/loanDocuments/${userIdentifier}/${firstLoanId}_${unixStamp}.pdf`;
        let loan_path = await getSignedUrlforDocument(loan_document_url.slice(1));
        loanDocument = loan_path;
      } else {
        console.log('someErrorOccured');
      }
      let body = {
        uuid: arthmateUuid,
        partner_user_id: user_id.replace(/\s/g, ''),
        partner_line_id: creditLineId,
        am_line_id: arthmate_line_id,
        line_amount: 25000,
        updated_line_amount: 1000000,
        updated_agreement: loanDocument[0],
        updated_sanction_letter: loanDocument[0],
      };
      ({ result, error } = await handleData(
        'https://connect.arthmate.com/valyuV2/line_update',
        body,
        {
          headers: {
            Authorization: `Basic ${encodedString}`,
          },
        }
      ));
      let { data } = result || {};
      ({ status } = data || false);
      if (status) {
        let { am_line_id } = data;
        await updateIntoDatabase(
          `users/${userIdentifier}/workProfile/${employerName}`,
          'userData',
          {
            arthmate_line_id: am_line_id,
            arthmate: { ...arthmate, userLineCreationApiSuccess: status },
          }
        );
      }
      console.log(result, error, status);
      return { result, error, status };
    } catch (error) {
      console.log(error);
      return { result, error, status };
    }
  };
  
  
  const example = async() =>{
    let userIdentifiers = [8327776102, 7077553294, 9827255118, 7894323061, 6300068220, 9668155095, 7205464405, 8144567236, 7205796112, 9078072852, 8917443992, 9014762269, 8917234458, 6372255228, 9178373476, 7892500190, 8555806197, 8144344094, 7608957590, 8984924646, 7684987649, 7008275345, 9692770092, 8144372392, 7978900310, 8249808798, 9348683932, 6371462911, 7205536485, 9618074027, 6371757278, 6372527400, 6379043369, 7205290292, 7381621076, 7735766230, 7978590073, 7978679479, 8144607609, 8249653691, 8260017457, 8637280290, 8658158448, 8763900917, 8917559590, 8984019780, 9049085139, 9337801794, 9348781343, 9777241920, 9861664930, 7790023697, 9348236304, 9777719161, 6371977658, 7377890754, 9583902702, 6371966344, 7892108226, 8658273790, 6370603820, 8249827651, 9114302119, 9778711965, 8249369377, 8480660725]
    await asyncForEach(userIdentifiers , async(userIdentifier) =>{
      try {
        await updateUSerLineID(userIdentifier);
      } catch (error) {
        console.log(error);
      }
    })
    console.log("done");
  }
  example()
  
  // module.exports = updateUSerLineID;
  