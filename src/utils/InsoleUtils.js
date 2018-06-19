export function char2buf(str) {
    var out = new ArrayBuffer(str.length);
    var u16a = new Uint8Array(out);
    var strs = str.split("");
    for (var i = 0; i < strs.length; i++) {
        u16a[i] = strs[i].charCodeAt();
    }
    return out;
}

export function arrayBufferToBase64Str(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}
export function startWith(src, target){
    var reg=new RegExp("^"+target);
    return reg.test(src);
}

export function voltagePercent(voltage, state) {
  var result = 0;
  if (state == 2) {
    result = 100;
  } else if (state == 1) {//充电
    if (voltage >= 4.2) {
      result = 100
    } else if (voltage >= 4.1) {
      result = 85 + (voltage - 4.1) * 15 / 0.1
    } else if (voltage >= 4.0) {
      result = 73 + (voltage - 4.0) * 12 / 0.1
    } else if (voltage >= 3.9) {
      result = 54 + (voltage - 3.9) * 19 / 0.1
    } else if (voltage >= 3.8) {
      result = 24 + (voltage - 3.8) * 30 / 0.1
    } else if (voltage >= 3.7) {
      result = 10 + (voltage - 3.7) * 14 / 0.1
    } else if (voltage > 3.6) {
      result = 5 + (voltage - 3.6) * 5 / 0.1
    } else if (voltage > 3.5) {
      result = 3 + (voltage - 3.5) * 2 / 0.1
    } else if (voltage > 3.4) {
      result = 2 + (voltage - 3.4) * 1 / 0.1
    } else if (voltage > 3.3) {
      result = 1 + (voltage - 3.3) * 1 / 0.1
    } else if (voltage > 3.2) {
      result = 0 + (voltage - 3.2) * 1 / 0.1
    }
  } else if (state == 0) {//充电
    if (voltage >= 4.0) {
      result = 100
    } else if (voltage >= 3.9) {
      result = 80 + (voltage - 3.9) * 20 / 0.1
    } else if (voltage >= 3.8) {
      result = 50 + (voltage - 3.8) * 30 / 0.1
    } else if (voltage >= 3.7) {
      result = 20 + (voltage - 3.7) * 20 / 0.1
    } else if (voltage >= 3.6) {
      result = 10 + (voltage - 3.6) * 20 / 0.1
    } else if (voltage >= 3.5) {
      result = 3 + (voltage - 3.5) * 7 / 0.1
    } else if (voltage >= 3.4) {
      result = 2 + (voltage - 3.4) * 1 / 0.1
    } else if (voltage >= 3.3) {
      result = 1 + (voltage - 3.3) * 1 / 0.1
    } else if (voltage >= 3.2) {
      result = 0 + (voltage - 3.2) * 1 / 0.1
    }
  }
  result = Math.floor(result * 100) / 100
  return result;
}

export const timeStr = function (time) {
  let hours = parseInt(time / 3600)
  let minutes = parseInt((time % 3600) / 60)
  // let seconds = parseInt(time % 60)
  let seconds = 0 //暂时不用秒了
  console.log(hours)
  console.log(minutes)
  console.log(seconds)
  return (hours ? (hours + "时") : "") + (minutes ? (minutes + "分") : "") + (seconds ? (seconds + "秒") : "")
}

export function curentTimeStr() {
  var now = new Date();

  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日

  var hh = now.getHours();            //时
  var mm = now.getMinutes();          //分
  var ss = now.getSeconds();          //分

  var clock = year + "_";

  if (month < 10)
    clock += "0";

  clock += month + "_";

  if (day < 10)
    clock += "0";

  clock += day + "_";

  if (hh < 10)
    clock += "0";

  clock += hh + "_";
  if (mm < 10) clock += '0';
  clock += mm + "_";
  if (ss < 10) clock += '0';
  clock += ss;
  return (clock);
}