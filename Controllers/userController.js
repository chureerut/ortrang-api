const { setInternalBufferSize } = require("bson");
const users = require("../models/user");

exports.index = async (req, res, next) => {
  const user = await users.find();
  console.log(user);
  res.status(200).json({
    data: user,
  });
};

exports.show = async (req, res, next) => {
  try {

    const { lineid } = req.params;
    const user = await users.findOne({ lineid: lineid });
    console.log(user);
    if (!user) {
      res.status(200).json({
        data: {
          status: false,
          message: "ไม่พบข้อมูลสมาชิก",
        },
      });
    } else {
      res.status(200).json({
        data: user,
      });
    }
  } catch (error) {
    res.status(400).json({
      data: {
        status: false,
        message: "เกิดผิดพลาด " + error.message,
      },
    });
  }
};

exports.insert = async (req, res, next) => {
  console.log("insert",req.body);
  const {
    prefixes,
    name,
    gender,
    age,
    birthday,
    tel,
    address,
    rights,
    telcontact,
    status,
    lineid,
    linename,
    step,
  } = req.body;

  console.log("เกิด", birthday);

  let user = new users({
    prefixes: prefixes,
    name: name,
    gender: gender,
    age: age,
    birthday: birthday,
    tel: tel,
    address: address,
    rights: rights,
    telcontact: telcontact,
    status: status,
    lineid: lineid,
    linename: linename,
    step: step,
  });
  console.log(user);
  await user.save();

  res.status(201).json({
    message: "เพิ่มข้อมูลเรียบร้อย",
  });
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await users.deleteOne({ _id: id });
    console.log(user);
    if (user.deletedCount === 0) {
      throw new Error("ไม่สามารถลบข้อมูลได้");
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อย",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "เกิดผิดพลาด " + error.message,
      },
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      prefixes,
      name,
      gender,
      age,
      birthday,
      tel,
      address,
      rights,
      telcontact,
      status,
      lineid,
      linename,
      step,
    } = req.body;

    const user = await users.updateOne({ _id: id },{
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: age,
      birthday: birthday,
      tel: tel,
      address: address,
      rights: rights,
      telcontact: telcontact,
      status: status,
      lineid: lineid,
      linename: linename,
      step: step,
    })

    if(user.nModified === 0){
      res.status(400).json({
        error: {
          message: "ไม่สามารถอัปเดตข้อมูลได้",
        },
      });
    }
    else{
      res.status(200).json({
        message: "แก้ไขข้อมูลเรียบร้อย",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "เกิดผิดพลาด " + error.message,
      },
    });
  }
};