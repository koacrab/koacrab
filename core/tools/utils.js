'use strict';

const net = require('net');
const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");

const {
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
  isBuffer
} = require('core-util-is');

const isIP = net.isIP;
const isIPv4 = net.isIPv4;
const isIPv6 = net.isIPv6;

module.exports = {
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
  isBuffer,
  isIP,
  isIPv4,
  isIPv6,
  // 检测控制器是否为私有
  checkAct: function (name) {
    if (name && name.substr(0, 1) === '_') {
      return false;
    }

    return true;
  },

  readDirSync: function (dir, type) {
    let children = {};

    let read = function (dir, type) {
      fs.readdirSync(dir).forEach(function (filename) {
        let filePath = dir + "/" + filename;
        let stat = fs.statSync(filePath);
        let tempObj = {};

        if (stat && stat.isDirectory()) {
          read(filePath, filename);
        } else {
          let baseName = '';
          if (type) {
            baseName = type + '/' + path.basename(filename, '.js');
          } else {
            baseName = path.basename(filename, '.js');
          }

          tempObj[baseName] = filePath;
          Object.assign(children, tempObj);
        }
      });

      return children;

    }

    read(dir, type)
  },

  log(log, type = 'log') {
    if (typeof log === 'string') {
      console[type](`[${new Date()}] [koacrab] ${log}`);
    } else {
      const msg = log.stack || log.toString();
      console[type]();
      console[type](msg);
      console[type]();
    }
  },

  // 发送邮件 email,text,html,subject
  sendMail(options = {}) {
    let { smtp, from, fromName, pwd, defaultEmail, port, subject, text, html } = options;
    let toMail = defaultEmail || '';

    if (!from) {
      // console.log('请输入from邮箱');
      return false;
    }

    if (!toMail) {
      // console.log('请输入to邮箱');
      return false;
    }

    let mailOptions = {
      from: `${fromName} <${from}>`, // 发送者
      to: toMail, // 接受者,可以同时发送多个,以逗号隔开
      subject: subject || '无标题', // 标题
    };
    if (options.text) {
      mailOptions.text = text;// 文本
    }
    if (options.html) {
      mailOptions.html = html;// html,如果有html内容，则会覆盖text
    }

    let transporter = nodemailer.createTransport({
      host: smtp,
      secure: true, // 使用 SSL
      secureConnection: true, // 使用 SSL，是否使用TLS，true，端口为465，否则其他或者568
      port: port || 465, // SMTP 端口
      newline: "windows",
      logger: false,
      auth: {
        user: from,
        pass: pwd //授权码,通过QQ获取
      }
    });

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          resolve({
            error: 1,
            reason: `发送${toMail}的邮件失败`,
            result: err
          })

          console.log(`koacrab: 发送${toMail}的异常邮件失败`);
        } else {
          resolve({
            error: 0,
            reason: '发送成功',
            result: info || ''
          })
        }

        // transporter.close();
      });

    }).catch(err => console.log(err))
  },
  formatDate(timestamp, fmt) {
    let jsdate = ((timestamp) ? new Date(timestamp) : new Date());

    let o = {
      "M+": jsdate.getMonth() + 1, //月份   
      "d+": jsdate.getDate(), //日   
      "h+": jsdate.getHours(), //小时   
      "m+": jsdate.getMinutes(), //分   
      "s+": jsdate.getSeconds(), //秒   
      "q+": Math.floor((jsdate.getMonth() + 3) / 3), //季度   
      "S": jsdate.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (jsdate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
};


