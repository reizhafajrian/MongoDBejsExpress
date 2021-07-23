const Supplier = require("../models/Supplier");
const BarangMasuk = require("../models/BarangMasuk");
const Menu = require("../models/Menu");
const BarangKeluar = require("../models/BarangTerjual");
const User = require("../models/User");
const Role = require("../models/Role");
const BarangTerjual = require("../models/BarangTerjual");
const Discount = require("../models/Discount");
const Member = require("../models/Member");

const getAuth = async (email, password) => {
  return true;
};

const Users = async (req, res) => {
  const { email, password, role } = req.body;
  const roles = await Role.findOne({ Level: role });

  const user = await User.create({
    email: email,
    password: password,
    role: roles._id,
  });

  user.save();
  roles.User.push({ _id: user._id });
  roles.save();

  res.send(roles);
};
const Roles = async (req, res) => {
  const data = req.body;
  await Role.create(data);

  res.send("succes");
};
module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const login = await User.find({
      email: email,
      password: password,
    }).populate({ path: "role", select: "Level" });

    req.session.user = {
      id: login[0]._id,
      email: login[0].email,
      role: login[0].role.Level,
    };
    req.session.save();

    res.redirect("/");
  },
  adminlogin: async (req, res) => {
    res.render("Login", { title: "Login" });
  },
  logout: async (req, res) => {
    await req.session.destroy();
    res.redirect("login");
  },

  viewMenu: async (req, res) => {
    const email = req.session.user.email;
    try {
      const menu = await Menu.find();
      const alertMesage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMesage,
        status: alertStatus,
      };
      res.render("index", {
        title: "Kopi",
        menu,
        email,
        alert,
      });
    } catch (error) {}
  },
  deleteSupplier: async (req, res) => {
    const data = req.body;
    const supplier = await Supplier.findOneAndRemove({ _id: data.id });
    res.redirect("/supplier/1");
  },
  editSupplier: async (req, res) => {
    const data = req.body;
    console.log(data);
    res.redirect("supplier/1");
    await Supplier.findByIdAndUpdate(data.id, {
      name: data.name,
      address: data.address,
      phone: data.phone,
    });
  },
  viewSupplier: async (req, res) => {
    const email = req.session.user.email;
    try {
      const alertMesage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const { page } = req.params;
      const resPage = 5;
      const hasil = resPage * Number(page) - resPage;
      const data = await Supplier.find()
        .skip(resPage * page - resPage)
        .limit(resPage);
      const jumlahRes = await Supplier.count();

      const alert = {
        message: alertMesage,
        status: alertStatus,
      };
      res.render("tambah_supplier", {
        title: "Tambah Supplier | Kopi",
        alert,
        data,
        page,
        jumlahRes,
        action: "view",
        pages: Math.ceil(jumlahRes / resPage),
        email,
      });
      console.log("ini pages " + Math.ceil(jumlahRes / resPage));
    } catch (e) {
      console.log(e);
    }
  },
  searchSupplier: async (req, res) => {
    const email = req.session.user.email;
    const nama = req.query.nama;
    const renderData = (data) => {
      const alertMesage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMesage,
        status: alertStatus,
      };
      res.render("tambah_supplier", {
        title: "Tambah Supplier | Kopi",
        alert,
        data,
        action: "search",
        email,
      });
    };
    await Supplier.find({ name: nama })
      .then((data) => {
        renderData(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  addSupplier: async (req, res) => {
    const role = req.session.user.role;

    if (role === "admin") {
      try {
        const data = req.body;
        await Supplier.create(data);
        req.flash("alertMessage", "Success Add Supplier");
        req.flash("alertStatus", "success");
        res.redirect("/supplier/1");
      } catch (e) {}
    } else {
      req.flash("alertMessage", "Failed Add Supplier U are not admin");
      req.flash("alertStatus", "danger");
      res.redirect("/supplier/1");
    }
  },

  viewBarangMasuk: async (req, res) => {
    const email = req.session.user.email;
    try {
      const alertMesage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMesage,
        status: alertStatus,
      };
      const supplier = await Supplier.find();
      const data = await BarangMasuk.find().populate({
        path: "idSupplier",
        select: "name date",
      });
      console.log(data);
      res.render("tambah_barang_masuk", {
        title: "Tambah Barang Masuk | Kopi",
        alert,
        supplier,
        email,
        data,
      });
    } catch (e) {
      console.log(e);
    }
  },
  addBarangMasuk: async (req, res) => {
    if (req.session.user.role === "admin") {
      try {
        const { id_supplier, name, price, type, jumlah, total } = req.body;
        const supplier = await Supplier.findOne({ _id: id_supplier });
        const totalNumber = Number(total.replace(/\,/g, ""));

        const barangmasuk = {
          idSupplier: supplier._id,
          name,
          price,
          type,
          total: jumlah,
          totalPrice: totalNumber,
        };

        const createBarangMasuk = await BarangMasuk.create(barangmasuk);
        await supplier.idBarang.push({ _id: createBarangMasuk._id });
        await supplier.save();
        req.flash("alertMessage", `Berhasil Menambahkan barang masuk`);
        req.flash("alertStatus", "success");
        res.redirect("/barangmasuk");
      } catch (e) {
        console.log(e);
      }
    } else {
      req.flash(
        "alertMessage",
        `Gagal Menambahkan barang masuk anda Bukan admin`
      );
      req.flash("alertStatus", "success");
      res.redirect("/barangmasuk");
    }
  },
  editBarangMasuk: async (req, res) => {
    const data = req.body;
    const totalNumber = Number(data.total_price.replace(/\,/g, ""));

    try {
      const barangmasuk = await BarangMasuk.findByIdAndUpdate(data.id, {
        name: data.name_menu,
        price: data.price,
        type: data.type,
        total: data.jumlah,
        totalPrice: totalNumber,
      });
      barangmasuk.save();

      req.flash("alertMessage", `Berhasil Menghapus barang masuk`);
      req.flash("alertStatus", "success");
      res.redirect("/barangmasuk");
    } catch (error) {
      console.log(error);
    }
  },
  deleteBarangMasuk: async (req, res) => {
    const { id } = req.body;
    await BarangMasuk.findByIdAndRemove(id);
    res.redirect("/barangmasuk");
  },
  viewAddMenu: async (req, res) => {
    const email = req.session.user.email;
    const menu = await Menu.find();
    try {
      const alertMesage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const barang = await BarangMasuk.find();
      const alert = {
        message: alertMesage,
        status: alertStatus,
      };
      res.render("tambah_menu", {
        title: "Tambah Menu",
        alert,
        barang,
        email,
        data: menu,
      });
    } catch (error) {}
  },
  editOrderMenu: async (req, res) => {
    const data = req.body;
    try {
      const menu = await Menu.findById(data.id);
      menu.name = data.name_menu;
      menu.price = Number(data.price);
      menu.jumlahBarangTerpakai = Number(data.jumlah);
      menu.save();
      res.redirect("/tambahmenu");
    } catch (error) {
      console.log(error);
    }
  },
  deleteMenu: async (req, res) => {
    const { id } = req.body;
    console.log(id);
    await Menu.findByIdAndRemove(id);
    res.redirect("/tambahmenu");
  },
  addMenu: async (req, res) => {
    const email = req.session.user.email;
    if (req.session.user.role === "admin") {
      try {
        const { name_menu, id_barang, type, jumlah, price } = req.body;
        const barangMasuk = await BarangMasuk.findOne({ _id: id_barang });

        const tambahMenu = await Menu.create({
          name: name_menu,
          price: price,
          type: type,
          jumlahBarangTerpakai: jumlah,
          idBarangMasuk: id_barang,
          email,
        });

        await barangMasuk.idMenu.push({ _id: tambahMenu._id });
        await barangMasuk.save();

        res.redirect("/tambahmenu");
      } catch (error) {
        console.log(error);
      }
    } else {
      req.flash(
        "alertMessage",
        `Gagal Menambahkan barang masuk anda Bukan admin`
      );
      req.flash("alertStatus", "success");
      res.redirect("/tambahmenu");
    }
  },
  orderMenu: async (req, res) => {
    try {
      const email = req.session.user.email;
      let { nama_menu, nama_id, jumlah, total_price, phone } = req.body;

      const alertMesage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMesage,
        status: alertStatus,
      };

      if (jumlah.length > 0) {
        const data = [];
        for (let index = 0; index < jumlah.length; index++) {
          if (jumlah[index] !== "0") {
            const menu = await Menu.findOne({ _id: nama_id[index] }).populate({
              path: "idBarangMasuk",
              select: "_id name price total",
            });

            if (menu.idBarangMasuk.total - menu.jumlahBarangTerpakai >= 0) {
              const barangLaku = await BarangKeluar.create({
                idMenu: nama_id[index],
                jumlah: jumlah[index],
                totalPrice: total_price[index],
              });
              const barangMasuks = await BarangMasuk.findOneAndUpdate(
                { _id: menu.idBarangMasuk._id },
                {
                  total: menu.idBarangMasuk.total - menu.jumlahBarangTerpakai,
                }
              );

              await menu.idTerjual.push({ _id: barangLaku._id });
              await menu.save();
              data.push({
                namaMenu: nama_menu[index],
                jumlah: jumlah[index],
                totalPrice: total_price[index],
              });
            }
          }
        }
        res.render("Print", {
          title: "Print",
          data: data,
          email,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  laporanKeuangan: async (req, res) => {
    const email = req.session.user.email;
    const data = await BarangKeluar.find().populate({
      path: "idMenu",
      select: "_id price name",
    });
    console.log(data);
    res.render("laporan_keuangan", {
      title: "Laporan Keuangan",
      email,
      data,
    });
  },
  getDateFilter: async (req, res) => {
    const email = req.session.user.email;
    const start = req.query.start;
    const end = req.query.end;

    const hasil = await BarangTerjual.find({
      date: { $gte: start, $lt: end },
    }).populate({
      path: "idMenu",
      select: "_id price name",
    });
    console.log(hasil);
    res.render("laporan_keuangan", {
      title: "Laporan Keuangan",
      email,
      data: hasil,
    });
  },
  viewMember: async (req, res) => {
    const email = req.session.user.email;
    const alertMesage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const menu = await Menu.find().populate({
      path: "discount",
      select: "discount",
    });
    console.log(menu, "ini menunya");
    const barang = await BarangMasuk.find();
    const alert = {
      message: alertMesage,
      status: alertStatus,
    };

    res.render("tambah_member", {
      title: "Tambah Member",
      email,
      alert,
      data: menu,
      barang,
    });
  },
  editDiscount: async (req, res) => {
    const data = req.body;
    const discount = await Discount.create({
      discount: data.discount,
      idMenu: data.id,
    });
    const menu = await Menu.findOneAndUpdate(
      { _id: data.id },
      {
        discount: discount._id,
      }
    );
    menu.save();
    res.redirect("/createmember");
  },
  addMember: async (req, res) => {
    const data = req.body;
    const member = await Member.create({
      name: data.name,
      phoneNumber: data.phone,
      address: data.address,
    });
    member.save();
  },
  print: async (req, res) => {
    const email = req.session.user.email;
    const { data } = req.body;
    res.render("Print", {
      title: "Print",
      data: data,
      email,
    });
  },
};
