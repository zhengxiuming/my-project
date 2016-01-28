var utils = {};
utils.win = function (attr, value) {
    if (typeof value === "undefined") {
        return document.documentElement[attr] || document.body[attr];
    }
    document.documentElement[attr] = value;
    document.body[attr] = value;
};
utils.getElementsByClass = function (str) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(str);
    }
    str = str.replace(/^ +| +$/g, "");
    var aClass = str.split(/ +/);
    var eles = document.body.getElementsByTagName("*");
    for (var i = 0; i < aClass.length; i++) {
        var reg = RegExp("(^| )" + aClass[i] + "( |$)");
        var ary = [];
        for (var j = 0; j < eles.length; j++) {
            var ele = eles[j];
            if (reg.test(ele.className)) {
                ary.push(ele);
            }
        }
        eles = ary;
    }
    return eles;
};
utils.addClass=function(ele,strClass){
    ele.className+=" "+strClass;
    var  reg=RegExp("(^| )"+strClass+"( |$)");
    if(!reg.test(ele.className)){
        ele.className+=" "+strClass;
    }
};

utils.removeClass = function removeClass(curEle, strClass) {
    var reg = new RegExp("(^| +)" + strClass + "( +|$)", "g");
    if (this.hasClass(curEle, strClass)) {
        curEle.className = curEle.className.replace(reg, " ");
    }
};
utils.siblings=function (ele){//获得ele的所有的元素兄弟节点
    var nodes=ele.parentNode.childNodes;
    var a=[];
    for(var i=0;i<nodes.length;i++){
        var node=nodes[i];
        if(node!=ele&&node.nodeType==1){
            a.push(node);
        }
    }
    return a;
};
utils.getIndex=function (ele){//获得ele的索引值
    var index=0;
    var p=ele.previousSibling;
    while(p){
        if(p.nodeType===1){
            index++
        }
        p=p.previousSibling;
    }
    return index;
};
utils.prevSiblings=function (ele){//找ele的哥哥们
    var nodes=ele.parentNode.childNodes;
    var a=[];
    for(var i=0;i<nodes.length;i++){
        var node=nodes[i];
        if(node==ele)break;
        if(node.nodeType==1){
            a.push(node);
        }
    }
    return a;
};
utils.nextSiblings=function (ele){//找弟弟们
    var nodes=ele.parentNode.childNodes;
    var a=[];
    for(var i=nodes.length-1;i>=0;i--){
        var node=nodes[i];
        if(node==ele)break;
        if(node.nodeType==1){
            a.unshift(node);
        }
    }
    return a;
};
utils.prev=function (ele){//找相邻的唯一的哥哥
    /*var a=prevSiblings(ele);
     return a[a.length-1]*/
    if(ele.previousElementSibling){
        return ele.previousElementSibling;
    }
    var p=ele.previousSibling;
    while(p){
        if(p.nodeType==1){
            return p;
        }
        p=p.previousSibling;
    }
    return null;
};
utils.next=function (ele){//找相邻的唯一的弟弟
    //return DOM.nextSiblings(ele)[0];
    var n=ele.nextSibling;
    while(n){
        if(n.nodeType===1){
            return n;
        }
        n=n.nextSibling;
    }
    return null;
};
//utils.children=function(ele,strTag){//strTag表示通过这个变量指明的标签来筛选子元素
//    var children=ele.children;
//    if(1){
//        var a=[];
//        for(var i=0;i<children.length;i++){
//            var child=children[i];
//            if(child.tagName==strTag.toUpperCase()){
//                a.push(child);
//            }
//        }
//        return a;
//    }
//};
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
utils.last = function last(curEle, tagName) {
    var child = this.children(curEle, tagName);
    return child[child.length - 1];
};
utils.each=function each(cur, callback, context) {
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
utils._children=function(ele){//获得ele的所有的元素子节点
    var children=ele.children;

    if(typeof ele.nextElementSibling !="object"){
        var a=[];
        for(var i=0;i<children.length;i++){
            if(children[i].nodeType===1){
                a.push(children[i]);
            }
        }
    }
    return children;
};
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
utils.hasClass = function hasClass(curEle, strClass) {
    var reg = new RegExp("(^| +)" + strClass + "( +|$)");
    return reg.test(curEle.className);
};
utils.toggleClass = function toggleClass(curEle, strClass) {
    this.hasClass(curEle, strClass) ? this.removeClass(curEle, strClass) : this.addClass(curEle, strClass);
};