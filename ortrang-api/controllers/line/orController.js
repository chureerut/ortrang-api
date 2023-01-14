const request = require("request-promise");
const axios = require("axios").default;
const http = require("http");
const { ConnectionStates } = require("mongoose");
const { JSONCookie } = require("cookie-parser");

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer w9mXshP9juZXSwgkDH5AKY2LDTMtfZAWm+yksqDypAfOIwntf05tmecxCqqDACstoHQSbV6gUijvQ/6OWh//KL3sNv9atxrPNtywmIq2afwJEZlzDSY621QFk+ABQJH4JUdfsgMpw27DbPzr9TwcKAdB04t89/1O/w1cDnyilFU=`,
};

const URL_API = `http://localhost:3000/api`;

exports.index = async (req, res, next) => {
  console.log(req.body);
  console.log(req.body.events[0]);
  let replyToken = req.body.events[0].replyToken;
  let useridline = req.body.events[0].source.userId;

  if (req.body.events[0].type == "message") {
    request(
      {
        method: "GET",
        uri: `${URL_API}/user/${useridline}`,
      },
      (err, res, body) => {
        const detail = JSON.parse(body);
        console.log(detail.data.status);
        if (
          typeof req.body.events[0].message.text != undefined &&
          req.body.events[0].message.text != null
        ) {
          console.log(req.body.events[0].message.text);
          console.log(replyToken);
          if (req.body.events[0].message.text === "ลงทะเบียน") {
            request(
              {
                method: "GET",
                uri: `${URL_API}/user/${useridline}`,
              },
              (err, res, body) => {
                const detail = JSON.parse(body);
                if (detail.data.status === false) {
                  ReplyPrefixes(replyToken);
                } else {
                  ReplyRegister(replyToken, "เคยมีการลงทะเบียนแล้วค่ะ");
                }
              }
            );
          } else if (req.body.events[0].message.text === "ความรู้เรื่องโรค") {
            ReplyNumberOTP(replyToken);
          } else if (
            req.body.events[0].message.text === "การปฏิบัติตัวผู้ป่วยผ่าตัด"
          ) {
            ReplyNumberOTP2(replyToken);
          } else if (
            req.body.events[0].message.text.substring(0, 1) === "T" ||
            req.body.events[0].message.text.substring(0, 1) === "t"
          ) {
            ReplyAddress(replyToken);
          } else if (
            req.body.events[0].message.text.substring(0, 1) === "H" ||
            req.body.events[0].message.text.substring(0, 1) === "h"
          ) {
            ReplyRights(replyToken);
          } else if (
            req.body.events[0].message.text.substring(0, 2) === "CT" ||
            req.body.events[0].message.text.substring(0, 2) === "ct"
          ) {
            console.log("test999");
            ReplyDetailRegister(replyToken);
          } else if (
            req.body.events[0].message.text !== "ลงทะเบียน" ||
            req.body.events[0].message.text !== "ความรู้เรื่องโรค" ||
            req.body.events[0].message.text !== "การปฏิบัติตัวผู้ป่วยผ่าตัด" ||
            req.body.events[0].message.text.substring(0, 1) !== "T" ||
            req.body.events[0].message.text.substring(0, 1) !== "t" ||
            req.body.events[0].message.text.substring(0, 1) !== "H" ||
            req.body.events[0].message.text.substring(0, 1) !== "h" ||
            req.body.events[0].message.text.substring(0, 2) !== "CT" ||
            req.body.events[0].message.text.substring(0, 2) !== "ct"
          ) {
            //gender
            ReplyGender(replyToken);
          }
        }
      }
    );
  }

  if (req.body.events[0].type == "postback") {
    console.log("test0", req.body.events[0].postback);
    console.log("test1", req.body.events[0].postback.data);
    if (
      req.body.events[0].postback.data === "นาย" ||
      req.body.events[0].postback.data === "นาง" ||
      req.body.events[0].postback.data === "นางสาว" ||
      req.body.events[0].postback.data === "เด็กหญิง" ||
      req.body.events[0].postback.data === "เด็กชาย"
    ) {
      
      const bodyJSON = {
        prefixes: "",
        name: "nong",
        gender: "ชาย",
        age: "32 ปี",
        birthday: "2022-07-06",
        address: "H4566",
        tel: "T0868643011",
        rights: "",
        telcontact: "",
        status: true,
        lineid: "",
        linename: "",
        step: "",
      }
      request(
        {
          method: "POST",
          uri: `${URL_API}/user`,
          body: JSON.stringify(bodyJSON),
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          console.log("test5",http);
          console.log("เรียบร้อย",detail);
          // if (res.statusCode == 201) {
          //   ReplyName(replyToken);
          // }
        }
      );
    } else if (
      req.body.events[0].postback.data === "ชาย" ||
      req.body.events[0].postback.data === "หญิง"
    ) {
      const dateBirthday = formatDate(new Date());
      console.log(dateBirthday);
      ReplyBirthday(replyToken, dateBirthday);
    } else if (req.body.events[0].postback.data === "Birthday") {
      console.log("test2", req.body.events[0].postback);
      console.log("test3", req.body.events[0].postback.data);
      console.log("test4", req.body.events[0].postback.params);

      if (req.body.events[0].postback.params !== undefined) {
        const PickerDate = req.body.events[0].postback.params;
        console.log(PickerDate);
        ReplyConfirm(replyToken, PickerDate.date);
      }
    } else if (req.body.events[0].postback.data === "ตกลง") {
      ReplyAge(replyToken);
    } else if (req.body.events[0].postback.data === "แก้ไข") {
      console.log("test");
      const dateBirthday = formatDate(new Date());
      ReplyBirthday(replyToken, dateBirthday);
    } else if (
      req.body.events[0].postback.data === "1-10" ||
      req.body.events[0].postback.data === "11-20" ||
      req.body.events[0].postback.data === "21-30" ||
      req.body.events[0].postback.data === "31-40" ||
      req.body.events[0].postback.data === "41-50" ||
      req.body.events[0].postback.data === "51-60" ||
      req.body.events[0].postback.data === "61-70" ||
      req.body.events[0].postback.data === "71-80" ||
      req.body.events[0].postback.data === "81-90" ||
      req.body.events[0].postback.data === "91-100"
    ) {
      ReplyNumberAge(replyToken, req.body.events[0].postback.data);
    } else if (req.body.events[0].postback.data.endsWith("ปี") === true) {
      ReplyTel(replyToken);
    } else if (
      req.body.events[0].postback.data === "ข้าราชการ" ||
      req.body.events[0].postback.data === "รัฐวิสาหกิจ" ||
      req.body.events[0].postback.data === "ประกันสุขภาพ" ||
      req.body.events[0].postback.data === "ประกันสังคม" ||
      req.body.events[0].postback.data === "เงินสด"
    ) {
      ReplyTelContact(replyToken);
    }
  }

  //res.send('Hi');
};

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function ReplyRegister(replyToken, text) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: text,
      },
    ],
  });
  DetailReply(body);
}

function ReplyPrefixes(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกคำนำหน้าชื่อ",

        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "นาย",
                data: "นาย",
                displayText: "นาย",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "นาง",
                data: "นาง",
                displayText: "นาง",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "นางสาว",
                data: "นางสาว",
                displayText: "นางสาว",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "เด็กชาย",
                data: "เด็กชาย",
                displayText: "เด็กชาย",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "เด็กหญิง",
                data: "เด็กหญิง",
                displayText: "เด็กหญิง",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyName(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "$ กรอกชื่อ-นามสกุล\n(โดยไม่ต้องใส่คำนำหน้า)",
        emojis: [
          {
            index: 0,
            productId: "5ac1bfd5040ab15980c9b435",
            emojiId: "009",
          },
        ],
      },
    ],
  });
  DetailReply(body);
}
function ReplyGender(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกเพศ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "ชาย",
                data: "ชาย",
                displayText: "ชาย",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "หญิง",
                data: "หญิง",
                displayText: "หญิง",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyBirthday(replyToken, dateBirthday) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกวันเกิด",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "datetimepicker",
                label: "Birthday",
                data: "Birthday",
                mode: "date",
                initial: dateBirthday,
                // max: "2023-12-01",
                // min: "2023-01-01",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyConfirm(replyToken, date) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "วันเกิด " + date,
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "ตกลง",
                data: "ตกลง",
                Text: "ตกลง",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "แก้ไข",
                data: "แก้ไข",
                Text: "แก้ไข",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyAge(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกช่วงอายุ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "1-10",
                data: "1-10",
                displayText: "1-10",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "11-20",
                data: "11-20",
                displayText: "11-20",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "21-30",
                data: "21-30",
                displayText: "21-30",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "31-40",
                data: "31-40",
                displayText: "31-40",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "41-50",
                data: "41-50",
                displayText: "41-50",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "51-60",
                data: "51-60",
                displayText: "51-60",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "61-70",
                data: "61-70",
                displayText: "61-70",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "71-80",
                data: "71-80",
                displayText: "71-80",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "81-90",
                data: "81-90",
                displayText: "81-90",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "91-100",
                data: "91-100",
                displayText: "91-100",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyNumberAge(replyToken, Range) {
  let Range1 = 0;
  let Range2 = 0;
  let Range3 = 0;
  let Range4 = 0;
  let Range5 = 0;
  let Range6 = 0;
  let Range7 = 0;
  let Range8 = 0;
  let Range9 = 0;
  let Range10 = 0;
  if (Range === "1-10") {
    Range1 = 1 + " ปี";
    Range2 = 2 + " ปี";
    Range3 = 3 + " ปี";
    Range4 = 4 + " ปี";
    Range5 = 5 + " ปี";
    Range6 = 6 + " ปี";
    Range7 = 7 + " ปี";
    Range8 = 8 + " ปี";
    Range9 = 9 + " ปี";
    Range10 = 10 + " ปี";
  } else if (Range === "11-20") {
    Range1 = 11 + " ปี";
    Range2 = 12 + " ปี";
    Range3 = 13 + " ปี";
    Range4 = 14 + " ปี";
    Range5 = 15 + " ปี";
    Range6 = 16 + " ปี";
    Range7 = 17 + " ปี";
    Range8 = 18 + " ปี";
    Range9 = 19 + " ปี";
    Range10 = 20 + " ปี";
  } else if (Range === "21-30") {
    Range1 = 21 + " ปี";
    Range2 = 22 + " ปี";
    Range3 = 23 + " ปี";
    Range4 = 24 + " ปี";
    Range5 = 25 + " ปี";
    Range6 = 26 + " ปี";
    Range7 = 27 + " ปี";
    Range8 = 28 + " ปี";
    Range9 = 29 + " ปี";
    Range10 = 30 + " ปี";
  } else if (Range === "31-40") {
    Range1 = 31 + " ปี";
    Range2 = 32 + " ปี";
    Range3 = 33 + " ปี";
    Range4 = 34 + " ปี";
    Range5 = 35 + " ปี";
    Range6 = 36 + " ปี";
    Range7 = 37 + " ปี";
    Range8 = 38 + " ปี";
    Range9 = 29 + " ปี";
    Range10 = 40 + " ปี";
  } else if (Range === "41-50") {
    Range1 = 41 + " ปี";
    Range2 = 42 + " ปี";
    Range3 = 43 + " ปี";
    Range4 = 44 + " ปี";
    Range5 = 45 + " ปี";
    Range6 = 46 + " ปี";
    Range7 = 47 + " ปี";
    Range8 = 48 + " ปี";
    Range9 = 49 + " ปี";
    Range10 = 50 + " ปี";
  } else if (Range === "51-60") {
    Range1 = 51 + " ปี";
    Range2 = 52 + " ปี";
    Range3 = 53 + " ปี";
    Range4 = 54 + " ปี";
    Range5 = 55 + " ปี";
    Range6 = 56 + " ปี";
    Range7 = 57 + " ปี";
    Range8 = 58 + " ปี";
    Range9 = 59 + " ปี";
    Range10 = 60 + " ปี";
  } else if (Range === "61-70") {
    Range1 = 61 + " ปี";
    Range2 = 62 + " ปี";
    Range3 = 63 + " ปี";
    Range4 = 64 + " ปี";
    Range5 = 65 + " ปี";
    Range6 = 66 + " ปี";
    Range7 = 67 + " ปี";
    Range8 = 68 + " ปี";
    Range9 = 69 + " ปี";
    Range10 = 70 + " ปี";
  } else if (Range === "71-80") {
    Range1 = 71 + " ปี";
    Range2 = 72 + " ปี";
    Range3 = 73 + " ปี";
    Range4 = 74 + " ปี";
    Range5 = 75 + " ปี";
    Range6 = 76 + " ปี";
    Range7 = 77 + " ปี";
    Range8 = 78 + " ปี";
    Range9 = 79 + " ปี";
    Range10 = 80 + " ปี";
  } else if (Range === "81-90") {
    Range1 = 81 + " ปี";
    Range2 = 82 + " ปี";
    Range3 = 83 + " ปี";
    Range4 = 84 + " ปี";
    Range5 = 85 + " ปี";
    Range6 = 86 + " ปี";
    Range7 = 87 + " ปี";
    Range8 = 88 + " ปี";
    Range9 = 89 + " ปี";
    Range10 = 90 + " ปี";
  } else if (Range === "91-100") {
    Range1 = 91 + " ปี";
    Range2 = 92 + " ปี";
    Range3 = 93 + " ปี";
    Range4 = 94 + " ปี";
    Range5 = 95 + " ปี";
    Range6 = 96 + " ปี";
    Range7 = 97 + " ปี";
    Range8 = 98 + " ปี";
    Range9 = 99 + " ปี";
    Range10 = 100 + " ปี";
  }

  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกอายุ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: Range1,
                data: Range1,
                displayText: Range1,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range2,
                data: Range2,
                displayText: Range2,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range3,
                data: Range3,
                displayText: Range3,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range4,
                data: Range4,
                displayText: Range4,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range5,
                data: Range5,
                displayText: Range5,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range6,
                data: Range6,
                displayText: Range6,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range7,
                data: Range7,
                displayText: Range7,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range8,
                data: Range8,
                displayText: Range8,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range9,
                data: Range9,
                displayText: Range9,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range10,
                data: Range10,
                displayText: Range10,
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyTel(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "กรอกเบอร์โทร \n(พิมพ์ T แล้วตามด้วยเบอร์โทร ตัวอย่าง T099xxxxxxx)",
      },
    ],
  });
  DetailReply(body);
}

function ReplyAddress(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "กรอกที่อยู่ \n(พิมพ์ H แล้วตามด้วยที่อยู่)",
      },
    ],
  });
  DetailReply(body);
}
function ReplyRights(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกสิทธิ์ในการรักษาพยาบาล",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "ข้าราชการ",
                data: "ข้าราชการ",
                displayText: "ข้าราชการ",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "รัฐวิสาหกิจ",
                data: "รัฐวิสาหกิจ",
                displayText: "รัฐวิสาหกิจ",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "ประกันสุขภาพ",
                data: "ประกันสุขภาพ",
                displayText: "ประกันสุขภาพ",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "ประกันสังคม",
                data: "ประกันสังคม",
                displayText: "ประกันสังคม",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "เงินสด",
                data: "เงินสด",
                displayText: "เงินสด",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyTelContact(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "กรอกเบอร์โทรติดต่อฉุกเฉิน \n(พิมพ์ CT แล้วตามด้วยเบอร์โทร ตัวอย่าง CT099xxxxxxx)",
      },
    ],
  });
  DetailReply(body);
}

function ReplyDetailRegister(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                margin: "none",
                contents: [
                  {
                    type: "text",
                    text: "ข้อมุลการลงทะเบียน",
                    size: "md",
                    weight: "bold",
                    color: "#057DDF",
                    align: "center",
                    wrap: true,
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "คำนำหน้าชื่อ : นางสาว",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "ชื่อ : จุรีรัตน์ เดชพละ",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "เพศ : หญิง",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "วันเกิด : 1991-05-21",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "อายุ : 31",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "เบอร์ : T 0868643011",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "ที่อยู่ : H 2/188 ดอนเมือง",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "ใช้สิทธิ์ : ประกันสังคม",
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "เบอร์ติดต่อฉุกเฉิน : 0990862013",
                        color: "#467EAC",
                        wrap: true,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyNumberOTP(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              header: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "ไส้เลื่อนคืออะไร ?",
                    weight: "bold",
                    size: "sm",
                    color: "#2055F0FF",
                  },
                ],
              },
              hero: {
                type: "image",
                url: "https://msc.healthcare/wp-content/uploads/2021/06/week-1-May_Content-2_pic2-1024x1024.jpg",
                size: "full",
                aspectRatio: "20:16",
                aspectMode: "cover",
                action: {
                  type: "uri",
                  label: "Action",
                  uri: "https://linecorp.com/",
                },
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "Play",
                      uri: "https://youtu.be/vr9_59-e-yI",
                    },
                    color: "#0768bf",
                    gravity: "center",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyNumberOTP2(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      // {
      //   type: "template",
      //   altText: "this is a buttons template",
      //   template: {
      //     type: "buttons",
      //     thumbnailImageUrl: "https://www.vejthani.com/wp-content/uploads/2020/11/15216-vejthani-post.jpg",
      //     imageBackgroundColor: "#0F86D8",
      //     title: "การปฏิบัติตัวผู้ป่วยก่อนผ่าตัด",
      //     text: "การผ่าตัดถุงน้ำดีโดยใช้กล้อง Laparoscopic  Cholecystectomy",
      //     actions: [
      //       {
      //         type: "uri",
      //         label: "Click",
      //         uri: "https://docs.google.com/presentation/d/1cNL_thicFWiZpAlukpXA8PGYmiIJ4G6t/edit?usp=sharing&ouid=109901892117280064703&rtpof=true&sd=true"
      //       }
      //     ]
      //   }
      // },

      {
        type: "template",
        altText: "this is a carousel template",
        template: {
          type: "carousel",
          columns: [
            {
              title: "การผ่าตัดถุงน้ำดี",
              text: "การผ่าตัดถุงน้ำดีโดยใช้กล้อง Laparoscopic  Cholecystectomy",
              actions: [
                {
                  type: "uri",
                  label: "Click",
                  uri: "https://docs.google.com/presentation/d/1eYekXZYtsuguwme7LT9NPmQF8SH-C6PM/edit?usp=sharing&ouid=106641890493840843334&rtpof=true&sd=true",
                },
              ],
              imageBackgroundColor: "#0F86D8",
              thumbnailImageUrl:
                "https://www.nonthavej.co.th/upload/content/1357/image2_20200430110913.jpg",
            },
            {
              title: "การปฏิบัติตัวผู้ป่วยก่อนผ่าตัด",
              text: "การผ่าตัดถุงน้ำดีโดยใช้กล้อง Laparoscopic  Cholecystectomy",
              actions: [
                {
                  type: "uri",
                  label: "Click",
                  uri: "https://drive.google.com/file/d/1Sm-1uto51mOEjM_lDBokwiOpMobz16ZI/view?usp=sharing",
                },
              ],
              imageBackgroundColor: "#0F86D8",
              thumbnailImageUrl:
                "https://www.vejthani.com/wp-content/uploads/2020/10/15051-vejthani-post-1024x1024.jpg",
            },
            {
              title: "การปฏิบัติตัวผู้ป่วยหลังผ่าตัด",
              text: "การผ่าตัดถุงน้ำดีโดยใช้กล้อง Laparoscopic  CholecystectoText",
              actions: [
                {
                  type: "uri",
                  label: "Click",
                  uri: "https://docs.google.com/presentation/d/1eYekXZYtsuguwme7LT9NPmQF8SH-C6PM/edit?usp=sharing&ouid=106641890493840843334&rtpof=true&sd=true",
                },
              ],
              imageBackgroundColor: "#0F86D8",
              thumbnailImageUrl:
                "https://www.nonthavej.co.th/upload/content/1261/image2_20210330105608.jpg",
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function DetailReply(body) {
  console.log(LINE_HEADER);
  request.post(
    {
      url: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      body: body,
    },
    (err, res, body) => {
      console.log("err = " + err);
      console.log("status = " + res.statusCode);
    }
  );
}
