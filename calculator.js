(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          throw new Error('该环境不能够正常运行');
        }
        return facroty(w);
      }
  } else {
    factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
  var arr = [];
  var document = window.document;
  var indexOf = arr.indexOf;
  var push = arr.push;
  var isFunction = function isFunction(obj) {
    return typeof obj === 'function' && typeof obj.nodeType !== 'number';
  }
  var isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  var
    version = '0.0.1',
    Calculator = function (selector) {
      this.div = document.querySelector(selector);
      this.init();
    };
  Calculator.prototype = {
    //版本号
    cal: version,

    length: 0,
    //计算结果
    Count: '',
    backup: [],
    inputingArr: [],
    resultCache: [],
    //是否有计算结果
    hasResult: false,
    Calculation: null,
    constructor: Calculator,
    init: function () {
      var that = this;
      that.createUIROOT();

    },
    viewJson: [
      [{
        "c": "delete"
      }, {
        "x": "delete1"
      }, {
        "/": "division"
      }],
      [{
        "7": "shuzi7"
      }, {
        "8": "shuzi8"
      }, {
        "9": "shuzi9"
      }, {
        "*": "chenghao"
      }],
      [{
        "4": "shuzi4"
      }, {
        "5": "shuzi5"
      }, {
        "6": "shuzi6"
      }, {
        "-": "jian"
      }],
      [{
        "1": "shuzi1"
      }, {
        "2": "shuzi2"
      }, {
        "3": "shuzi3"
      }, {
        "+": "jia"
      }],
      [{
        "0": "shuzi0"
      }, {
        ".": "dian"
      }, {
        "=": "equals"
      }],
    ],
    createBefore: function () {
      this.createUIROOT();

    },
    inners: '',
    /**创建wrap */
    createUIROOT: function () {
      var that = this;
      var div = document.createElement('div');
      var child = '';
      var json = this.viewJson;
      that.inners += '<div><h3 class="vice-screen">&nbsp;</h3><h1 class="main-screen count">0</h1></div>'
      that.createUI(json, child);
      div.innerHTML = that.inners;
      div.className = 'calculators';
      that.div.appendChild(div);
      that.onclick();
      that.keyboardFn();
    },
    /**创建子元素 */
    createUI: function (arr) {
      var that = this;
      if (!typeof arr === 'object' && arr instanceof Array) return;
      for (var i = 0, len = arr.length; i < len; i++) {

        var item = arr[i];

        if (item instanceof Array) {
          that.inners += '<div class="num-wrapper">';
          that.createUI(item);
          continue;
        }
        for (var key in item) {
          that.inners += '<a class="num" href="javascript:void(0);" data-source="' + key + '"><span class="iconfont icon-' + item[key] + '"></span></a>';
          if (i == len - 1) {
            that.inners += '</div>';

          }
        }

      }
    },
    /**重置 */
    reset: function () {
      this.Count = 0;
      this.backup = [];
      this.resultCache = [];
      this.inputingArr = [];
      this.hasResult = false;
      this.Calculation = null;
      this.div.querySelector('.main-screen').innerText = 0;
      this.div.querySelector('.vice-screen').innerHTML = '';
    },
    /**元素单击事件 */
    onclick: function () {
      var that = this;
      var saved = that.resultCache;
      document.addEventListener('click', function (e) {
        var target = e.target;

        if (target.tagName === 'A') {
          console.log('单击：' + target.innerHTML);
          var source = target.dataset.source;
          var h1 = document.querySelector('.vice-screen');
          if (source === '=') {
            that.equal();
          }
          that.keyProcessing(source);

          h1.innerHTML = that.Count;
          console.log(`Count：${that.Count}；Total：${that.resultCache}；`)
        }
      })
    },
    numAnimation: function () {

    },
    addition: function (n1, n2) {
      return n1 + n2;
    },
    subtraction: function (n1, n2) {
      return n1 - n2;
    },
    getResult: function () {

    },
    defaultFn: function (count) {
      if (parseInt(count) === 0) {

      }
    },
    keyProcessing: function (val) {
      if (typeof parseInt(val) === 'number' && typeof parseInt(val) !== NaN && '0123456789.'.indexOf(val) !== -1) {
        this.numberProcessing(val);
      } else if (this.inArray(val, ['+', '-', '*', '/'])) {
        this.operatorProcessing(val);
      } else {
        this.otherProcessing(val);
      }
    },
    /**其它值 */
    otherProcessing: function (inputted) {
      var that = this;
      switch (inputted) {
        case 'c':
          this.reset();
          break;
        case 'x':
          this.deleteNumber();
          break;
      }
    },
    /**输入为数字 */
    numberProcessing: function (inputted) {

      var that = this;
      if (that.hasResult) {
        that.reset();
      }

      if (inputted === '.') {
        if (that.resultCache[that.resultCache.length - 1] === '.') return
        if (that.inArray(that.resultCache[that.resultCache.length - 1], ['+', '-', '*', '/']) || that.resultCache.length === 0) {
          that.Count += 0;
        }
      }
      var saved = that.resultCache;
      var Count = that.Count;
      that.inputingArr.push(inputted);
      var idx = saved.length - 1 === -1 ? 0 : saved.length - 1;
      if (parseInt(inputted) === 0) {
        if (that.resultCache.length !== 0) {
          saved.push(inputted);
          that.backup.push(inputted);
          Count += inputted;
          that.Count = Count;
          return;
        }
        saved[idx] = inputted;
        that.backup[idx] = inputted;

        Count = inputted;
      } else {
        if (parseInt(saved[idx]) === NaN) {
          saved[idx] += inputted;
          that.backup[idx] += inputted;
        } else {
          saved.push(inputted);
          that.backup.push(inputted);
        }

        if (Count === 0) {
          Count = inputted;
        } else {
          Count += inputted;
        }
        that.Count = Count;
      }
    },
    /**输入为运算符 */
    operatorProcessing: function (inputted) {
      var that = this;
      if (!that.inArray(inputted, ['+', '-', '*', '/']) || inputted === that.resultCache[that.resultCache.length - 1]) return;
      if (that.resultCache[that.resultCache.length - 1] === '.') {
        if (that.resultCache.length === 0) {
          that.resultCache[0] = 0;
          that.Count = 0;
          that.backup[0] = 0;
        }
        that.resultCache.shift();
        that.Count = that.Count.substring(0, that.Count.length - 1);
        that.backup.shift();
      }
      var saved = that.resultCache;
      var count = that.Count;
      that.hasResult = false;
      that.inputingArr = [];

      var idx = saved.length - 1 === -1 ? 0 : saved.length - 1;
      if (that.isEqual(saved[idx], ['+', '-', '*', '/'])) {

        that.resultCache[idx] = inputted;
        that.backup[idx] = inputted;
        var val = inputted;
        if (!that.inArray(val, ['+', '-'])) {
          val === '/' ? val = '÷' : '';
          val === '*' ? val = '×' : '';
        }
        var newStr = count.charAt(0, count.length - 1);
        newStr += val;
        that.Count = newStr;
        return;
      }
      if (that.inArray(inputted, ['+', '-'])) {
        count += inputted;
      } else {
        inputted === '/' ? count += '÷' : '';
        inputted === '*' ? count += '×' : '';
      }
      if (that.resultCache.length == 3) {
        var th = that.resultCache.join('');
        var over = eval(th);
        var mains = document.querySelector('.main-screen');
        mains.innerHTML = over;
        that.resultCache = [over, inputted];
        that.Calculation = over;
      } else {
        that.resultCache.push(inputted)
      }
      that.backup.push(inputted);
      that.Count = count;
    },
    inArray: function (content, arr) {
      if (!content) return false;
      var i = arr.length;
      while (i--) {
        if (content.indexOf(arr[i]) !== -1) {
          return true;
        }
      }
      return false;
    },
    isEqual: function (content, arr) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === content) {
          return true;
        }
      }
      return false;
    },
    calculating: function (arr) {
      // if (arr.length === 2) {
      //   return 0;
      // }

      var nums = arr.join('');
      console.log(nums);
      var result = eval(nums);
      return result;
    },
    /**等于 */
    equal: function () {
      if (this.backup[this.backup.length - 1] === '.') {
        this.backup.pop();
        this.resultCache.pop();
        this.Count = this.Count.substring(0, this.Count.length - 1);
      }
      if (!this.inArray(this.backup[this.backup.length - 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])) return;

      var main = this.div.querySelector('.main-screen');
      var vice = this.div.querySelector('.vice-screen');
      this.hasResult = true;
      var result = this.calculating(this.backup);
      this.resultCache = [result];
      this.backup = [];
      this.backup[0] = result;
      this.Count = result;
      vice.innerHTML = '&nbsp;';
      main.innerText = result;

    },
    /**键盘输入 */
    keyboardFn: function () {
      var that = this;
      window.addEventListener('keydown', function (e) {
        var key = e.key;
        var h1 = document.querySelector('.vice-screen');
        if (key === 'Enter') {
          that.equal();
          return;
        }
        that.keyProcessing(key);

        h1.innerHTML = that.Count;
      })
    },
    deleteNumber(num) {
      var count = this.Count;
      this.resultCache.pop();
      this.backup.pop();
      this.Count = (this.Count).toString().substring(0, count.length - 1);
      console.log(this.Count);
      console.log(this.resultCache)
    }

  }
  window.calculator = Calculator;
})