//存储到localStorage
// var storage = {
//   set: function (key, value) {
//     localStorage.setItem(key, JSON.stringify(value));
//   },
//   get: function (key) {
//     return JSON.parse(localStorage.getItem(key));
//   },
//   remove: function (key) {
//     localStorage.removeItem(key);
//   }
// };

var storage = {
  set:function(key,value){
    $.cookie(key,value);
  },
  get:function(key){
    return $.cookie(key);
  },
  remove:function(key){
    $.cookie(key,null);
  }
}

export default storage;
