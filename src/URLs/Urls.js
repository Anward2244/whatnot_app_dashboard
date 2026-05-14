const Url = "http://213.210.36.19:5047/"

export const URLS = {
  Base: Url,

  login: Url + "adminLogin",
  
  //profile
  getProfile: Url + "getAdminDetails",
  UpdateProfile: Url + "updateAdminProfile",
  ChangePass: Url + "changeAdminpassword",

  forget: Url + "generateOtp",
  OTP: Url + "validateOtp",
  Resetpass: Url + "forgotPassword",

  //Brand
  getBrand: Url + "getBrands",
  getBrandSearch: Url + "getBrands?searchQuery=",
  UpdateBrand: Url + "updateBrand",
  deleteBrand: Url + "deleteBrand",

  //Category
  getCategory: Url + "getCategories",
  getCategorySearch: Url + "getCategories?searchQuery=",
  UpdateCategory: Url + "updateCategory",
  deleteCategory: Url + "deleteCategory",

  //Product
  getProducts: Url + "getAllproducts",
  getProductsSearch: Url + "getAllproducts?searchQuery=",
  getOneProduct: Url + "getSingleProduct",
  UpdateProduct: Url + "updateProduct",
  deleteProduct: Url + "deleteProduct",
  BlukUploadProduct: Url + "bulkUploadProduct",

  //Faqs
  getFaqs: Url + "getFaqs",
  UpdateFaqs: Url + "updateFaqs",
  deleteFaqs: Url + "deleteFaqs",

  //Banners
  getBanners: Url + "getBanners",
  UpdateBanners: Url + "updateBanner",
  deleteBanners: Url + "deleteBanner",

  //Settings
  GetSetting: Url + "getPolicies",
  UpdateSettings: Url + "updatePolicies",

  //Maintenance
  GetMaintenance: Url + "getMaintenance",
  UpdateMaintenance: Url + "setMaintenance",
  ToggleMaintenance: Url + "toggleMaintenance",

  //Contact
  GetContact: Url + "contactUs",
  UpdateContact: Url + "updateContactDetails",

  //AllPromoters
  GetAllPromoters: Url + "getAllPromoters",
  GetPromotersearch: Url + "getAllPromoters?searchQuery=",
  GetOnePromoters: Url + "promoters/getPromoterById",
  UpdateKyc: Url + "approveKycByPromoterId",
  RejectKyc: Url + "rejectKyc",
  PromotersChangepassword: Url + "changePromoterpasswordByAdmin",

  GetAllPromoterReRequest: Url + "getAllKyc_reverification_requests",
  GetAllPromoterReRequestSearch:
    Url + "getAllKyc_reverification_requests?searchQuery=",
  UpdatePromoterReRequest: Url + "approve_kyc_reverification_req",

  //AllPromotersWallet
  GetAllPromotersWallet: Url + "getAllPendingWalletRequests",
  GetAllPromotersWalletSearch: Url + "getAllPendingWalletRequests?searchQuery=",
  UpdateAllPromotersWallet: Url + "updateAllPromotersDetails",

  //Notification
  GetNotifications: Url + "getNotifications",
  AddNotifications: Url + "sendNotifications",
  DeleteNotifications: Url + "deleteNotification",

  //SalesGetSales,
  ApprovedSales: Url + "ApproveSales",
  RejectSales: Url + "rejectSale",
  GetAllSales: Url + "getAllSales",
  GetAllSalesSearch: Url + "getAllSales?searchQuery=",

  //Wallet,
  GetAllWallet: Url + "getPendingWalletRequests",

  ApprovedWallet: Url + "walletApproval",
  GetAllWalletPayment: Url + "getAllPayments",
  GetAllWalletPaymentSearch: Url + "getAllPayments?searchQuery=",

  RejectWallet: Url + "walletRejection",
  GetRejectAllWalletPayment: Url + "getAllRejectedWalletRequests",
  GetRejectAllWalletPaymentSearch:
    Url + "getAllRejectedWalletRequests?searchQuery=",

  SalesReports: Url + "getSaleReports",
  PaymentReports: Url + "getpaymentReports",

  GetDashboad: Url + "dashboardCount",

  TargetsChanges: Url + "setMonthTarget",

  FeedBack: Url + "getAllQueries",
}
