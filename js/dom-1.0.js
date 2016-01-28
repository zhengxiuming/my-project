/*
 * zhufengDOM/$dom:珠峰培训最新版DOM库 v1.0
 */
(function () {
    var utils = {};

    /*
     * isNum、isStr、isBoo...检测数据类型的方法
     * @parameter
     *    value:要检测数据类型的数据
     * @return
     *    是否为对应的数据类型
     *
     * Example:isNum(12)->true  isAry("")->false ...
     */
    var numObj = {
        isNum: "Number",
        isStr: "String",
        isBoo: "Boolean",
        isNul: "Null",
        isUnd: "Undefined",
        isObj: "Object",
        isAry: "Array",
        isFun: "Function",
        isReg: "RegExp",
        isDate: "Date"
    }, isType = function () {
        var outerArg = arguments[0];
        return function () {
            var innerArg = arguments[0], reg = new RegExp("^\\[object " + outerArg + "\\]$", "i");
            return reg.test(Object.prototype.toString.call(innerArg));
        }
    };
    for (var key in numObj) {
        if (numObj.hasOwnProperty(key)) {
            utils[key] = isType(numObj[key]);
        }
    }

    /*
     * each:实现数组和对象的遍历
     * @parameter
     *   cur:要操作的数组或者对象
     *   callback:每一次遍历要做的事情,方法中有三个参数:item->每一次遍历的当前项 index->每一次遍历的索引 input->原始的数组或者对象
     *   context:更改callback中的this关键字为context
     */
    zhufengDOM.each = function each(cur, callback, context) {
        if (typeof callback !== "function") return;
        context = context || window;

        //操作的是一个数组
        var i = 0;
        if (this.isAry(cur)) {
            if ("forEach" in Array.prototype) {
                cur.forEach(callback, context);
                return;
            }
            for (i = 0; i < cur.length; i++) {
                callback.call(context, cur[i], i, cur);
            }
            return;
        }

        //对象中还有可能出现的是类数组(有length属性的对象)
        if (cur.hasOwnProperty("length")) {
            for (i = 0; i < cur.length; i++) {
                callback.call(context, cur[i], i, cur);
            }
            return;
        }

        //操作的是一个对象(禁止遍历原型上的公有属性)
        for (var key in cur) {
            if (cur.hasOwnProperty(key)) {
                callback.call(context, cur[key], key, cur);
            }
        }
    };

    /*
     * listToArray:实现将类数组转换为数组
     * @parameter
     *    likeAry:要转换的类数组
     * @return
     *    转换完成的数组
     */
    utils.listToArray = function listToArray(likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry);
        } catch (e) {
            this.each(likeAry, function (item, index) {
                ary[ary.length] = item;
            });
        }
    };

    /*
     * extend:在DOM库上扩展方法
     * @parameter
     *    options:包含扩展方法的对象集合
     */
    utils.extend = function extend(options) {
        this.each(options, function (item, key) {
            this[key] = item;
        }, this);
    };

    window.zhufengDOM = window.$dom = utils;
})();

(function () {
    var utils = {};

    /*
     * getElementsByClass:通过元素的样式类名获取一个元素集合
     * @parameter
     *    strClass:样式类名,可以是多个样式类名组合,例如:"w100 w200"
     *    context:获取元素集合的上下文
     * @return
     *    返回包含所匹配元素的"数组集合"
     */
    utils.getElementsByClass = function getElementsByClass(strClass, context) {
        //this->$dom
        context = context || document;

        //如果当前的浏览器兼容内置的getElementsByClassName方法的话,我们使用内置的方法
        if ("getElementsByClassName" in document) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }

        //如果不兼容内置的方法,则采用如下的代码实现我们的获取
        var strAry = strClass.replace(/(^ +)|( +$)/g, "").split(/\s+/), tagList = context.getElementsByTagName("*"), ary = [];
        this.each(tagList, function (curTag, index) {
            //在当前的元素上增加一个标识flag,记录自身的样式类名是否和我们传递进来的strClass吻合
            //使用假设法,假设是吻合的,那么接下来我只需要判断假设的是否正确即可
            curTag.flag = true;
            for (var k = 0; k < strAry.length; k++) {
                var reg = new RegExp("(^| +)" + strAry[k] + "( +|$)");
                if (!reg.test(curTag.className)) {
                    curTag.flag = false;
                    break;
                }
            }
            curTag.flag ? ary[ary.length] = curTag : null;
        });
        return ary;
    };

    /*
     * children:获取当前元素下所有指定标签名的元素子节点集合
     * @parameter
     *    curEle:当前元素
     *    tagName:指定的标签名
     * @return
     *    [Array]符合条件的所有的元素子节点
     */
    utils.children = function children(curEle, tagName) {
        var nodeList = curEle.childNodes, ary = [];
        this.each(nodeList, function (curNode, index) {
            //如果是元素子节点我们才会获取
            if (curNode.nodeType === 1) {
                //还需要判断tagName是否传递了
                //如果没有传递,默认是只要是元素子节点就是我们想要的
                //如果传递了,那么不仅仅是元素子节点而且标签名必须和我们的tagName保持一致才可以
                if (typeof tagName === "string") {
                    var curNodeLow = curNode.nodeName.toLowerCase();
                    var tagNameLow = tagName.toLowerCase();
                    if (curNodeLow === tagNameLow) {
                        ary[ary.length] = curNode;
                    }
                } else {
                    ary[ary.length] = curNode;
                }
            }
        });
        return ary;
    };

    //prev:获取当前元素的上一个哥哥元素节点
    utils.prev = function prev(curEle) {
        if ("previousElementSibling" in curEle) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    };

    //prevAll:获取当前元素的所有的哥哥元素节点
    utils.prevAll = function prevAll(curEle) {
        var pre = this.prev(curEle), ary = [];
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    };

    //getIndex:获取当前元素的索引
    utils.getIndex = function getIndex(curEle) {
        return this.prevAll(curEle).length;
    };

    //next:获取当前元素的下一个弟弟元素节点
    utils.next = function next(curEle) {
        if ("nextElementSibling" in curEle) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    };

    //nextAll:获取当前元素的所有的弟弟元素节点
    utils.nextAll = function nextAll(curEle) {
        var nex = this.next(curEle), ary = [];
        while (nex) {
            ary[ary.length] = nex;
            nex = this.next(nex);
        }
        return ary;
    };

    //sibling:获取当前元素的相邻两个兄弟元素节点(哥哥+弟弟)
    utils.sibling = function sibling(curEle) {
        var pre = this.prev(curEle), nex = this.next(curEle), ary = [];
        pre ? ary[ary.length] = pre : null;
        nex ? ary[ary.length] = nex : null;
        return ary;
    };

    //siblings:获取当前元素的所有的兄弟元素节点
    utils.siblings = function siblings(curEle) {
        var preA = this.prevAll(curEle), nexA = this.nextAll(curEle);
        return preA.concat(nexA);
    };

    //first:获取当前元素指定标签名的所有元素子节点中的第一个
    utils.first = function first(curEle, tagName) {
        return this.children(curEle, tagName)[0];
    };

    //last:获取当前元素指定标签名字的所有元素子节点中的最后一个
    utils.last = function last(curEle, tagName) {
        var child = this.children(curEle, tagName);
        return child[child.length - 1];
    };

    window.zhufengDOM.extend(utils);
})();

(function () {
    var utils = {};

    /*
     * css:设置或者获取元素的style样式值
     * @parameter
     *     curEle:要操作的当前的元素
     *     attr:要操作的样式属性
     *     value:要设置的值,如果这个参数不传递是获取样式,传递是设置样式
     * @return
     *     获取的样式值
     */
    utils.css = function css(curEle, attr, value) {
        //get style
        var reg = /^[+-]?(\d|([1-9]\d+))(\.\d+)?(px|pt|em|rem)$/;
        if (typeof value === "undefined") {
            var val = null;
            if ("getComputedStyle" in window) {
                val = window.getComputedStyle(curEle, null)[attr];
            } else {
                if (attr === "opacity") {
                    var temp = curEle.currentStyle["filter"], tempReg = /^alpha\(opacity=((?:\d|(?:[1-9]\d+))(?:\.\d+)?)\)$/;
                    val = tempReg.test(temp) ? tempReg.exec(temp)[1] : "1";
                    val = parseFloat(val) / 100;
                } else {
                    val = curEle.currentStyle[attr];
                }
            }
            return reg.test(val) ? parseFloat(val) : val;
        }

        //set style
        reg = /^(width|height|top|left|right|bottom|((margin|padding)(Left|Top|Right|Bottom)?))$/;
        if (attr === "opacity") {
            if (value >= 0 && value <= 1) {
                curEle["style"]["opacity"] = value;
                curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            }
        } else if (attr === "float") {
            curEle["style"]["cssFloat"] = value;
            curEle["style"]["styleFloat"] = value;
        } else if (reg.test(attr)) {
            curEle["style"][attr] = isNaN(value) ? value : value + "px";
        } else {
            curEle["style"][attr] = value;
        }
    };

    //setGroupCss:批量设置元素的样式属性值
    utils.setGroupCss = function setGroupCss(curEle, options) {
        this.each(options, function (item, key) {
            this.css(curEle, key, item);
        }, this);
    };

    //offset:获取当前元素距离body的偏移量(上偏移top 和 左偏移left)
    utils.offset = function offset(curEle) {
        var p = curEle.offsetParent, l = curEle.offsetLeft, t = curEle.offsetTop;
        while (p) {
            if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
                l += p.clientLeft;
                t += p.clientTop;
            }
            l += p.offsetLeft;
            t += p.offsetTop;
            p = p.offsetParent;
        }
        return {top: t, left: l};
    };

    //win:设置或者获取浏览器的盒子模型信息
    utils.win = function (attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    };

    //hasClass:判断当前元素是否拥有某一个样式类名
    utils.hasClass = function hasClass(curEle, strClass) {
        var reg = new RegExp("(^| +)" + strClass + "( +|$)");
        return reg.test(curEle.className);
    };

    //addClass:给当前元素增加样式类名
    utils.addClass = function addClass(curEle, strClass) {
        if (!this.hasClass(curEle, strClass)) {
            curEle.className += " " + strClass;
        }
    };

    //removeClass:移除当前元素的样式类名
    utils.removeClass = function removeClass(curEle, strClass) {
        var reg = new RegExp("(^| +)" + strClass + "( +|$)", "g");
        if (this.hasClass(curEle, strClass)) {
            curEle.className = curEle.className.replace(reg, " ");
        }
    };

    //toggleClass:如果当前样式类名存在,则是移除,不存在则是增加
    utils.toggleClass = function toggleClass(curEle, strClass) {
        this.hasClass(curEle, strClass) ? this.removeClass(curEle, strClass) : this.addClass(curEle, strClass);
    };

    window.zhufengDOM.extend(utils);
})();

(function () {
    var utils = {};

    //attr:获取或者设置当前元素的自定义属性
    utils.attr = function attr(curEle, attr, value) {
        if (typeof value === "undefined") {
            return attr === "class" ? curEle.className : curEle.getAttribute(attr);
        }
        attr === "class" ? curEle.className = value : curEle.setAttribute(attr, value);
    };

    //html:获取或者设置当前元素的内容
    utils.html = function html(curEle, value) {
        if (typeof value === "undefined") {
            return curEle.innerHTML;
        }
        curEle.innerHTML = value;
    };

    //val:获取或者设置当前表单元素的value值
    utils.val = function val(curEle, value) {
        if (typeof value === "undefined") {
            return curEle.value;
        }
        curEle.value = value;
    };

    //prepend:向指定容器的开头增加元素(依赖query.js)
    utils.prepend = function prepend(container, newEle) {
        var fir = this.first(container);
        fir ? container.insertBefore(newEle, fir) : container.appendChild(newEle);
    };

    //insertAfter:向指定容器中某个元素之前增加新元素(依赖query.js)
    utils.insertAfter = function insertAfter(oldEle, newEle) {
        var nex = this.next(oldEle), par = oldEle.parentNode;
        nex ? par.insertBefore(newEle, nex) : par.appendChild(newEle);
    };

    window.zhufengDOM.extend(utils);
})();

(function (pro) {
    //unique：Array distinct
    pro.unique = function unique() {
        var obj = {};
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            obj[cur] == cur ? (this[i] = this[this.length - 1], this.length -= 1, i--) : obj[cur] = cur;
        }
        obj = null;
        return this;
    };

    //myForEach：forEach compatibility
    pro.myForEach = function myForEach(callBack, context) {
        if (Array.prototype.forEach) {
            return this.forEach(callBack, context);
        }
        for (var i = 0; i < this.length; i++) {
            callBack.call(context, this[i], i, this);
        }
    };

    //myMap：map compatibility
    pro.myMap = function myMap(callBack, context) {
        if (Array.prototype.map) {
            return this.map(callBack, context);
        }
        for (var i = 0; i < this.length; i++) {
            this[i] = callBack.call(context, this[i], i, this);
        }
        return this;
    };
})(Array.prototype);

(function (pro) {
    //myTrim：Remove the string and space
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };

    //mySub：Intercept string, this method is distinguished in English
    pro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };

    //myFormatTime：Format time
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日 {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };

    //queryURLParameter：Gets the parameters in the URL address bar
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
})(String.prototype);