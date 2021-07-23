const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const auth = require("../middleware/Auth");




// router.post('/role',AdminController.Roles );
// router.post('/createuser',AdminController.Users );
//login

router.get("/login", AdminController.adminlogin);
router.post("/login", AdminController.login);
router.use(auth);
router.get("/logout", AdminController.logout);
/* GET home page. */
//kasir
router.get("/", AdminController.viewMenu);

//Admin
//supplier
router.get("/supplier/:page([0-9]*)", AdminController.viewSupplier);
router.put("/editSupplier", AdminController.editSupplier);
router.get("/supplier/search/", AdminController.searchSupplier);
router.delete("/deleteSupplier", AdminController.deleteSupplier);

router.post("/supplier/add", AdminController.addSupplier);
//tambahbarangmasuk
router.get("/barangmasuk", AdminController.viewBarangMasuk);
router.post("/barangmasuk/add", AdminController.addBarangMasuk);
router.put("/editbarangmasuk", AdminController.editBarangMasuk);
router.delete("/deleteBarang", AdminController.deleteBarangMasuk);

//tambah menu

router.get("/tambahmenu/", AdminController.viewAddMenu);
router.post("/tambahmenu/add", AdminController.addMenu);
router.post("/ordermenu", AdminController.orderMenu);
router.put("/editMenu", AdminController.editOrderMenu);
router.delete("/deleteMenu", AdminController.deleteMenu);

router.get("/laporan-keuangan/filter/", AdminController.getDateFilter);


router.get("/laporankeuangan", AdminController.laporanKeuangan);

//tambah member
router.get("/createmember", AdminController.viewMember);
router.post("/createmember/add", AdminController.addMember);
router.put("/editDiscount", AdminController.editDiscount);


module.exports = router;
