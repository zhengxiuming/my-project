/*
 * zhufengDOM/$dom:�����ѵ���°�DOM�� v1.0
 */
(function () {
    var utils = {};

    /*
     * isNum��isStr��isBoo...����������͵ķ���
     * @parameter
     *    value:Ҫ����������͵�����
     * @return
     *    �Ƿ�Ϊ��Ӧ����������
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
     * each:ʵ������Ͷ���ı���
     * @parameter
     *   cur:Ҫ������������߶���
     *   callback:ÿһ�α���Ҫ��������,����������������:item->ÿһ�α����ĵ�ǰ�� index->ÿһ�α��������� input->ԭʼ��������߶���
     *   context:����callback�е�this�ؼ���Ϊcontext
     */
    zhufengDOM.each = function each(cur, callback, context) {
        if (typeof callback !== "function") return;
        context = context || window;

        //��������һ������
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

        //�����л��п��ܳ��ֵ���������(��length���ԵĶ���)
        if (cur.hasOwnProperty("length")) {
            for (i = 0; i < cur.length; i++) {
                callback.call(context, cur[i], i, cur);
            }
            return;
        }

        //��������һ������(��ֹ����ԭ���ϵĹ�������)
        for (var key in cur) {
            if (cur.hasOwnProperty(key)) {
                callback.call(context, cur[key], key, cur);
            }
        }
    };

    /*
     * listToArray:ʵ�ֽ�������ת��Ϊ����
     * @parameter
     *    likeAry:Ҫת����������
     * @return
     *    ת����ɵ�����
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
     * extend:��DOM������չ����
     * @parameter
     *    options:������չ�����Ķ��󼯺�
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
     * getElementsByClass:ͨ��Ԫ�ص���ʽ������ȡһ��Ԫ�ؼ���
     * @parameter
     *    strClass:��ʽ����,�����Ƕ����ʽ�������,����:"w100 w200"
     *    context:��ȡԪ�ؼ��ϵ�������
     * @return
     *    ���ذ�����ƥ��Ԫ�ص�"���鼯��"
     */
    utils.getElementsByClass = function getElementsByClass(strClass, context) {
        //this->$dom
        context = context || document;

        //�����ǰ��������������õ�getElementsByClassName�����Ļ�,����ʹ�����õķ���
        if ("getElementsByClassName" in document) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }

        //������������õķ���,��������µĴ���ʵ�����ǵĻ�ȡ
        var strAry = strClass.replace(/(^ +)|( +$)/g, "").split(/\s+/), tagList = context.getElementsByTagName("*"), ary = [];
        this.each(tagList, function (curTag, index) {
            //�ڵ�ǰ��Ԫ��������һ����ʶflag,��¼�������ʽ�����Ƿ�����Ǵ��ݽ�����strClass�Ǻ�
            //ʹ�ü��跨,�������Ǻϵ�,��ô��������ֻ��Ҫ�жϼ�����Ƿ���ȷ����
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
     * children:��ȡ��ǰԪ��������ָ����ǩ����Ԫ���ӽڵ㼯��
     * @parameter
     *    curEle:��ǰԪ��
     *    tagName:ָ���ı�ǩ��
     * @return
     *    [Array]�������������е�Ԫ���ӽڵ�
     */
    utils.children = function children(curEle, tagName) {
        var nodeList = curEle.childNodes, ary = [];
        this.each(nodeList, function (curNode, index) {
            //�����Ԫ���ӽڵ����ǲŻ��ȡ
            if (curNode.nodeType === 1) {
                //����Ҫ�ж�tagName�Ƿ񴫵���
                //���û�д���,Ĭ����ֻҪ��Ԫ���ӽڵ����������Ҫ��
                //���������,��ô��������Ԫ���ӽڵ���ұ�ǩ����������ǵ�tagName����һ�²ſ���
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

    //prev:��ȡ��ǰԪ�ص���һ�����Ԫ�ؽڵ�
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

    //prevAll:��ȡ��ǰԪ�ص����еĸ��Ԫ�ؽڵ�
    utils.prevAll = function prevAll(curEle) {
        var pre = this.prev(curEle), ary = [];
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    };

    //getIndex:��ȡ��ǰԪ�ص�����
    utils.getIndex = function getIndex(curEle) {
        return this.prevAll(curEle).length;
    };

    //next:��ȡ��ǰԪ�ص���һ���ܵ�Ԫ�ؽڵ�
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

    //nextAll:��ȡ��ǰԪ�ص����еĵܵ�Ԫ�ؽڵ�
    utils.nextAll = function nextAll(curEle) {
        var nex = this.next(curEle), ary = [];
        while (nex) {
            ary[ary.length] = nex;
            nex = this.next(nex);
        }
        return ary;
    };

    //sibling:��ȡ��ǰԪ�ص����������ֵ�Ԫ�ؽڵ�(���+�ܵ�)
    utils.sibling = function sibling(curEle) {
        var pre = this.prev(curEle), nex = this.next(curEle), ary = [];
        pre ? ary[ary.length] = pre : null;
        nex ? ary[ary.length] = nex : null;
        return ary;
    };

    //siblings:��ȡ��ǰԪ�ص����е��ֵ�Ԫ�ؽڵ�
    utils.siblings = function siblings(curEle) {
        var preA = this.prevAll(curEle), nexA = this.nextAll(curEle);
        return preA.concat(nexA);
    };

    //first:��ȡ��ǰԪ��ָ����ǩ��������Ԫ���ӽڵ��еĵ�һ��
    utils.first = function first(curEle, tagName) {
        return this.children(curEle, tagName)[0];
    };

    //last:��ȡ��ǰԪ��ָ����ǩ���ֵ�����Ԫ���ӽڵ��е����һ��
    utils.last = function last(curEle, tagName) {
        var child = this.children(curEle, tagName);
        return child[child.length - 1];
    };

    window.zhufengDOM.extend(utils);
})();

(function () {
    var utils = {};

    /*
     * css:���û��߻�ȡԪ�ص�style��ʽֵ
     * @parameter
     *     curEle:Ҫ�����ĵ�ǰ��Ԫ��
     *     attr:Ҫ��������ʽ����
     *     value:Ҫ���õ�ֵ,�����������������ǻ�ȡ��ʽ,������������ʽ
     * @return
     *     ��ȡ����ʽֵ
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

    //setGroupCss:��������Ԫ�ص���ʽ����ֵ
    utils.setGroupCss = function setGroupCss(curEle, options) {
        this.each(options, function (item, key) {
            this.css(curEle, key, item);
        }, this);
    };

    //offset:��ȡ��ǰԪ�ؾ���body��ƫ����(��ƫ��top �� ��ƫ��left)
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

    //win:���û��߻�ȡ������ĺ���ģ����Ϣ
    utils.win = function (attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    };

    //hasClass:�жϵ�ǰԪ���Ƿ�ӵ��ĳһ����ʽ����
    utils.hasClass = function hasClass(curEle, strClass) {
        var reg = new RegExp("(^| +)" + strClass + "( +|$)");
        return reg.test(curEle.className);
    };

    //addClass:����ǰԪ��������ʽ����
    utils.addClass = function addClass(curEle, strClass) {
        if (!this.hasClass(curEle, strClass)) {
            curEle.className += " " + strClass;
        }
    };

    //removeClass:�Ƴ���ǰԪ�ص���ʽ����
    utils.removeClass = function removeClass(curEle, strClass) {
        var reg = new RegExp("(^| +)" + strClass + "( +|$)", "g");
        if (this.hasClass(curEle, strClass)) {
            curEle.className = curEle.className.replace(reg, " ");
        }
    };

    //toggleClass:�����ǰ��ʽ��������,�����Ƴ�,��������������
    utils.toggleClass = function toggleClass(curEle, strClass) {
        this.hasClass(curEle, strClass) ? this.removeClass(curEle, strClass) : this.addClass(curEle, strClass);
    };

    window.zhufengDOM.extend(utils);
})();

(function () {
    var utils = {};

    //attr:��ȡ�������õ�ǰԪ�ص��Զ�������
    utils.attr = function attr(curEle, attr, value) {
        if (typeof value === "undefined") {
            return attr === "class" ? curEle.className : curEle.getAttribute(attr);
        }
        attr === "class" ? curEle.className = value : curEle.setAttribute(attr, value);
    };

    //html:��ȡ�������õ�ǰԪ�ص�����
    utils.html = function html(curEle, value) {
        if (typeof value === "undefined") {
            return curEle.innerHTML;
        }
        curEle.innerHTML = value;
    };

    //val:��ȡ�������õ�ǰ��Ԫ�ص�valueֵ
    utils.val = function val(curEle, value) {
        if (typeof value === "undefined") {
            return curEle.value;
        }
        curEle.value = value;
    };

    //prepend:��ָ�������Ŀ�ͷ����Ԫ��(����query.js)
    utils.prepend = function prepend(container, newEle) {
        var fir = this.first(container);
        fir ? container.insertBefore(newEle, fir) : container.appendChild(newEle);
    };

    //insertAfter:��ָ��������ĳ��Ԫ��֮ǰ������Ԫ��(����query.js)
    utils.insertAfter = function insertAfter(oldEle, newEle) {
        var nex = this.next(oldEle), par = oldEle.parentNode;
        nex ? par.insertBefore(newEle, nex) : par.appendChild(newEle);
    };

    window.zhufengDOM.extend(utils);
})();

(function (pro) {
    //unique��Array distinct
    pro.unique = function unique() {
        var obj = {};
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            obj[cur] == cur ? (this[i] = this[this.length - 1], this.length -= 1, i--) : obj[cur] = cur;
        }
        obj = null;
        return this;
    };

    //myForEach��forEach compatibility
    pro.myForEach = function myForEach(callBack, context) {
        if (Array.prototype.forEach) {
            return this.forEach(callBack, context);
        }
        for (var i = 0; i < this.length; i++) {
            callBack.call(context, this[i], i, this);
        }
    };

    //myMap��map compatibility
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
    //myTrim��Remove the string and space
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };

    //mySub��Intercept string, this method is distinguished in English
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

    //myFormatTime��Format time
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}��{1}��{2}�� {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };

    //queryURLParameter��Gets the parameters in the URL address bar
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
})(String.prototype);