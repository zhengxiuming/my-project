window.onload=function(){
    //购物车效果
    var $topBarCart = $(".topBar .topBar-cart");
    var $cartMini = $("#cart-mini");
    var $cartMenu = $("#cart-menu");
    $topBarCart.mouseover(function () {
        $cartMini.addClass("select");
        $cartMenu.css("display", "block");
    });
    $topBarCart.mouseout(function () {
        $cartMini.removeClass("select");
        $cartMenu.css("display", "none");
    });
//搜索表单效果
    var search = document.getElementById("search");
    var searchWords = document.getElementById("search-words");
    var searchHotWords = document.getElementById("search-hotWords");
    var searchBtn = document.getElementById("search-btn");
    search.onfocus = search.onkeyup = function () {
        searchHotWords.style.display = "block";
        searchWords.style.display = "none";
        search.style.borderColor = searchBtn.style.borderColor = "#ff6700";
    };
    document.body.onclick = function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.id === "search") {
            return;
        }
        if (target.tagName.toLowerCase() === "a" && target.parentNode.parentNode.id === "searchWords") {
            searchHotWords.style.display = "none";
            search.value = target.innerHTML;
            return;
        }
        searchHotWords.style.display = "none";
        searchWords.style.display = "block";
        search.style.borderColor = searchBtn.style.borderColor = "#b0b0b0";
    };
    /* 导航栏选项卡效果 */
    $(function () {
        $(".nav-list>li").hover(function () {
            $(this).find(".item-children").stop().show();
        }, function () {
            $(this).find(".item-children").stop().hide();
        });
    });
//大轮播图效果
    var outer = document.getElementById("outer");
    var inner = document.getElementById("inner");
    var tip = document.getElementById("tip");
    var onLeft = outer.getElementsByClassName("onLeft")[0];
    var onRight = outer.getElementsByClassName("onRight")[0];
    var tipList = tip.getElementsByTagName("li");
    var imgList = inner.getElementsByTagName("div");
    var step = 0;
    var timer = null;

    function bindData() {
        var str = "";
        for (var i = 0; i < dataAry.length; i++) {
            str += "<div trueImg='" + dataAry[i] + "'></div>";
        }
        str += "<div trueImg='" + dataAry[0] + "'></div>";
        inner.innerHTML = str;
        str = "";
        for (i = 0; i < dataAry.length; i++) {
            var tipName = i === 0 ? "select" : null;
            str += "<li class='" + tipName + "'></li>";
        }
        tip.innerHTML = str;

        inner.style.width = (dataAry.length + 1) * 1226 + "px";
        tip.style.width = dataAry.length * 25 + "px";
    }
    bindData();
    function delayImg() {
        for (var i = 0; i < imgList.length; i++) {
            ~function (i) {
                var curImg = imgList[i];
                var oImg = new Image;
                oImg.src = curImg.getAttribute("trueImg");
                oImg.onload = function () {
                    curImg.appendChild(oImg);
                    animate(oImg, {opacity: 1}, 500);
                }
            }(i)
        }
    }
    window.setTimeout(delayImg, 500);
    function autoMove() {
        step++;
        if (step > 5) {
            inner.style.left = 0 + "px";
            step = 1;
        }
        animate(inner, {left: -step * 1226}, 500);
        changeTip();
    }
    timer = setInterval(autoMove, 2500);
    function leftMove() {
        step--;
        if (step < 0) {
            inner.style.left = -6130 + "px";
            step = 4;
        }
        animate(inner, {left: -step * 1226}, 500);
        changeTip();
    }
    function changeTip() {
        for (var i = 0; i < tipList.length; i++) {
            var stepTip = step === tipList.length ? 0 : step;
            tipList[i].className = i === stepTip ? "select" : null;
        }
    }
    for (var i = 0; i < tipList.length; i++) {
        tipList[i].index = i;
        tipList[i].onclick = function () {
            animate(inner, {left: -this.index * 1226}, 500);
            step = this.index;
            changeTip();
        }
    }
    outer.onmouseover = function () {
        onLeft.style.display = onRight.style.display = "block";
        window.clearInterval(timer);
    };
    outer.onmouseout = function () {
        onLeft.style.display = onRight.style.display = "none";
        timer = window.setInterval(autoMove, 2500);
    };
    onRight.onclick = function () {
        autoMove();
    };
    onLeft.onclick = function () {
        leftMove();
    };
//左侧导航
    var nav = document.getElementById("nav");
    var oLis = nav.getElementsByClassName("nav-list");
    for (var j = 0; j < oLis.length; j++) {
        var oLi = oLis[j];
        var oIn = oLi.getElementsByTagName("div")[0];
        oIn.style.top = -(j * 42 + 20) + "px";

        oLi.index = j;
        oLi.inner = oIn;
        oLi.onmouseover = function () {
            this.inner.style.display = "block";
            this.className = "select";
        };
        oLi.onmouseout = function () {
            this.inner.style.display = "none";
            this.className = "";
        };
    }
//小米明星单品左右切换
    $("#control-next").click(function () {
        $("#xm-carousel-list").animate({left: "-1240px"}, "normal");
        $(this).animate({opacity: "0.4"}, "slow");
        $("#control-prev").animate({opacity: "1"}, "slow");
    });
    $("#control-prev").click(function () {
        $("#xm-carousel-list").animate({left: "0px"}, "normal");
        $("#control-next").animate({opacity: "1"}, "slow");
        $(this).animate({opacity: "0.4"}, "slow");
    });

//网页所有选项卡效果
//获取所有的li元素
    $(".tab-list li").mouseover(function () {
        var $index = $(this).index();
        $(this).addClass("tab-active").siblings().removeClass("tab-active");
        //获取当前点击的Li对应的所有div
        $(this).parent().parent().parent().next().children().children(".span16").children()
            //让当前的所有的div都不显示，然后让当前点击的lI对应的div显示；
            .children().css("display", "none").eq($index).css("display", "block");
    });
//选项卡每一个lI的滑过样式
    $(".tab-content li").mouseover(function () {
        $(this).addClass("brick-item-active");
        $(this).children(".review-wrapper").stop().animate({"height": 76, "opacity": 1}, "fast");
    });
    $(".tab-content li").mouseout(function () {
        $(this).removeClass("brick-item-active");
        $(this).children(".review-wrapper").stop().animate({"height": 0, "opacity": 0}, "fast");
    });
//为你推荐轮播图效果
    var stepOther = 0;
    var timerOther = null;
    var recommendBd = document.getElementById("recommend-bd");
    var xmCarouselList = recommendBd.getElementsByClassName("xm-carousel-list")[0];
    var recommends=document.getElementById("recommend");
    var leftBtn=recommends.getElementsByClassName("control-prev")[0];
    var rightBtn=recommends.getElementsByClassName("control-next")[0];
    var moreBtn=recommends.getElementsByClassName("more")[0];
    moreBtn.onmouseover=function(){
        window.clearInterval(timerOther);
    };
    moreBtn.onmouseout=function(){
        timerOther = window.setInterval(otherAutoMove, 5000);
    };
    leftBtn.onclick=function(){
        otherAutoMove("left");
    };
    rightBtn.onclick=function(){
        otherAutoMove("right");
    };
    function otherAutoMove() {
        if (typeof arguments[0] === "undefined" || arguments[0] === "right") {
            stepOther++;
            if (stepOther > 4) {
                xmCarouselList.style.left = 0 + "px";
                stepOther = 1;
            }
            animate(xmCarouselList, {left: -stepOther * 1240}, 500);
        }
        if (arguments[0] === "left") {
            stepOther--;
            if (stepOther < 0) {
                xmCarouselList.style.left = -4960+ "px";
                stepOther = 3;
            }
            animate(xmCarouselList, {left: -stepOther * 1240}, 500);
        }
    }
    timerOther = window.setInterval(otherAutoMove, 5000);
//底部四个小轮播图
    var stepIndex=0;
    var contents=document.getElementById("content");
    var contentItemBook=contents.getElementsByClassName("content-item-book")[0];
    var itemLists=contents.getElementsByClassName("item-list")[0];
    var prevBtn=contents.getElementsByClassName("control-prev")[0];
    var nextBtn=contents.getElementsByClassName("control-next")[0];
    var xmPagers=contents.getElementsByClassName("xm-pagers")[0];
    var pageList=xmPagers.getElementsByTagName("li");
    function bigAutoMove(){
        if(arguments[0]==="right"){
            if (stepIndex >= 3) {
                return;
            }
            stepIndex++;
            animate(itemLists, {left: -stepIndex * 296}, 500, 1);
            console.log(stepIndex);
        }
        if(arguments[0]==="left"){
            if (stepIndex <= 0) {
                return;
            }
            stepIndex--;
            animate(itemLists, {left: -stepIndex * 296}, 500, 1);
            console.log(stepIndex);
        }
        changeEffectTip();
    }
    function changeEffectTip(){
        for(var i=0;i<pageList.length;i++){
            pageList[i].className=i===stepIndex?"pager-active":null;
        }
    }
    for(var i=0;i<pageList.length;i++){
        pageList[i].index=i;
        pageList[i].onclick=function(){
            animate(itemLists, {left: -this.index * 296}, 500);
            stepIndex = this.index;
            changeEffectTip();
        }
    }
    nextBtn.onclick=function(){
        bigAutoMove("right");
    };
    prevBtn.onclick=function(){
        bigAutoMove("left");
    };
    contentItemBook.onmouseover=function(){
        animate(nextBtn,{opacity:0.5},500);
        animate(prevBtn,{opacity:0.5},500);

    };
    contentItemBook.onmouseout=function(){
        animate(nextBtn,{opacity:0},500);
        animate(prevBtn,{opacity:0},500);
    };
//function changeTip() {
//    for (var i = 0; i < tipList.length; i++) {
//        var stepTip = step === tipList.length ? 0 : step;
//        tipList[i].className = i === stepTip ? "select" : null;
//    }
//}
//for (var i = 0; i < tipList.length; i++) {
//    tipList[i].index = i;
//    tipList[i].onclick = function () {
//        animate(inner, {left: -this.index * 1226}, 500);
//        step = this.index;
//        changeTip();
//    }
//}
//function bigAutoMove() {
//    if (typeof arguments[0] === "undefined" || arguments[0] === "right") {
//        stepOther++;
//        if (stepOther > 4) {
//            xmCarouselList.style.left = 0 + "px";
//            stepOther = 1;
//        }
//        animate(xmCarouselList, {left: -stepOther * 296}, 500);
//    }
//    if (arguments[0] === "left") {
//        stepOther--;
//        if (stepOther < 0) {
//            xmCarouselList.style.left = -888+ "px";
//            stepOther = 3;
//        }
//        animate(xmCarouselList, {left: -stepOther * 296}, 500);
//    }
//}
//autoTimer = window.setInterval(bigAutoMove, 5000);
//var stepIndex=0;
//$("#content .control-next").click(function(){
//    stepIndex++;
//    var $index = $(this).index();
//    if(stepIndex>=4){
//        return;
//    }
//    $(this).parent().prev().prev().children().animate({left:stepIndex*-296+"px"}, "normal");
//});
//$("#content .control-prev").click(function(){
//    stepIndex--;
//    if(stepIndex<=0){
//        return;
//    }
//    $(this).parent().prev().prev().children().animate({left:stepIndex*-296+"px"}, "normal");
//
//});
//回到顶部；
    var gotopArrow = document.getElementsByClassName("gotop-arrow")[0];
    gotopArrow.onclick = function () {
        var duration = 1000;
        var interval = 50;
        var totalTar = utils.win("scrollTop") - 0;
        var step = (totalTar / duration) * interval;
        var timer = window.setInterval(function () {
            var curT = utils.win("scrollTop");
            if (curT <= 0) {
                window.clearInterval(timer);
                return;
            }
            utils.win("scrollTop", curT - step);
        }, interval);
    };
    window.onscroll = function () {
        var curT = utils.win("scrollTop");
        var cliH = utils.win("clientHeight");
        gotopArrow.style.display = curT >= cliH ? "block" : "none";
    };
};


