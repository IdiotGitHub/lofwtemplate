function pageSize() {
    if (window.innerWidth < 625) {
        $(".content").css("width", "100%");
        $(".detail").css("width", "100%");
        $(".sendItem").css("width", "100%");
        $(".tag").css("width", "100%");
    } else {
        $(".content").css("width", "600px");
        $(".detail").css("width", "600px");
        $(".sendItem").css("width", "600px");
        $(".tag").css("width", "600px");
    }
}

/**
 * 点击导航栏广场
 * */
function hall() {
    $("#hall").parent().attr("class", "active");
    $("#hall").html('广场<span class="sr-only">(current)</span>');
    $("#followed").parent().removeAttr("class");
    $("#followed").html("关注");
    location.href = "./shouye.html"
}

/**
 * 关注动作
 * */
function checkFollowedStatus(element, itemUserId, userId) {
    var id = '.' + itemUserId;
    $.ajax({
        url: "http://localhost:8080/follow/doFollow?" + new Date().getTime(),
        type: "POST",
        xhrFields: {withCredentials: true},
        data: {itemUserId: itemUserId, userId: userId},
        success: function (data) {
            if (data.isLogin) {
                // var next = $(element).next();
                if (data.followStatus) {
                    $(id).html('关注');
                    // next.html(parseInt(next.text()) - 1);
                } else {
                    $(id).html('已关注');
                    // next.html(parseInt(next.text()) + 1);
                }
            } else {
                alert("登陆后才能关注");
            }
        }
    });
}


/**
 * 点赞的相关动作
 * @param element
 * @param itemId
 * @param userId
 */
function checkLikeStatus(element, itemId, userId) {
    // console.log(user)
    $.ajax({
        url: "http://localhost:8080/like/doLike?" + new Date().getTime(),
        type: "POST",
        xhrFields: {withCredentials: true},
        data: {itemId: itemId, userId: userId},
        success: function (data) {
            if (data.isLogin) {
                var next = $(element).next();
                if (data.likeStatus) {
                    $(element).html('点赞<span class="glyphicon glyphicon-heart-empty"></span>');
                    next.html(parseInt(next.text()) - 1);

                } else {
                    $(element).html('点赞<span class="glyphicon glyphicon-heart"></span>');
                    next.html(parseInt(next.text()) + 1);

                }
            } else {
                alert("登陆后才能进行点赞");
            }
        }
    });
}

/**
 * 收藏的相关动作
 * @param element
 * @param itemId
 * @param userId
 */
function checkFavouriteStatus(element, itemId, userId) {
    // console.log(user)
    $.ajax({
        url: "http://localhost:8080/favourite/doFavourite?" + new Date().getTime(),
        type: "POST",
        xhrFields: {withCredentials: true},
        data: {itemId: itemId, userId: userId},
        success: function (data) {
            if (data.isLogin) {
                var next = $(element).next();
                if (data.favouriteStatus) {
                    $(element).html('收藏<span class="glyphicon glyphicon-star-empty"></span>');
                    next.html(parseInt(next.text()) - 1);
                } else {
                    $(element).html('收藏<span class="glyphicon glyphicon-star"></span>');
                    next.html(parseInt(next.text()) + 1);
                }
            } else {
                alert("登陆后才能收藏");
            }
        }
    });
}

/**
 *userId是当前登陆用户id
 * */
function comment(itemId) {
    var itemId = '.comment' + itemId;
    $(itemId).slideToggle("normal", "swing");
}

/**
 * 退出登录
 * */
function logout() {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/user/logout",
        data: {},
        xhrFields: {withCredentials: true},
        success: function (data) {
            if (data.status == "success") {
                window.location.href = "./login.html";
            } else {
                alert("发生错误,原因为：" + data.data.errorMsg);
            }
        },
        error: function (data) {
            alert("错误,原因是：" + data.responseText);
        }
    });

}


/**
 * 加载分页页码
 * */
function loadPage(search, data, pageSize, userId) {
    var next = data.currentPage + 1;
    if (next >= data.totalPages) {
        next = data.totalPages;
    }
    /*    $("#totalPages").text(data.totalPages);
        $("#totalCounts").text(data.totalCounts);*/
    //页码展示
    var lis = "";
    var firstPage = '<li><a href="javascript:load(' + search + ', 1,' + pageSize + ',' + userId + ')">首页</a></li>';
    var prePage = '<li><a href="javascript:load(' + search + ',' + (data.currentPage - 1) + ',' + pageSize + ',' + userId + ')">上一页</a></li>';
    lis += firstPage + prePage;
    var begin;
    var end;
    //如果总页面不到10个
    if (data.totalPages < 10) {
        begin = 1;
        end = data.totalPages;
    } else {
        //总页面数超过10个
        begin = data.currentPage - 5;
        end = data.currentPage + 4;
        //如果左边不够五个，则右边补上
        if (begin < 1) {
            begin = 1;
            end = begin + 9;
        }
        //如果右边不够4个，则左边补上
        if (end > data.totalPages) {
            end = data.totalPages;
            begin = end - 9;
        }
    }
    //只显示end-begin长度的分页条
    for (var i = begin; i <= end; i++) {
        var li;
        //拼接字符串
        //判断是否是当前页面
        if (data.currentPage == i) {
            // li = '<li class="active"><a href="javascript:load(' + search + ',' + i + ',' + pageSize + ')">' + i + '</a></li>';
            li = '<li class="active"><span>' + i + '<span class="sr-only">(current)</span></span></li>';
        } else {

            li = '<li><a href="javascript:load(' + search + ',' + i + ',' + pageSize + ',' + userId + ')">' + i + '</a></li>';
        }
        lis += li;
    }
    var nextPage = '<li><a href="javascript:load(' + search + ',' + (next) + ',' + pageSize + ',' + userId + ')">下一页</a></li>';
    var lastPage = '<li><a href="javascript:load(' + search + ',' + data.totalPages + ',' + pageSize + ',' + userId + ')">末页</a></li>';
    lis += nextPage + lastPage;
    $("#page").html(lis);

}

/**
 * 获取url参数值
 * @param name
 * @returns {string|null}
 */
function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
}

$(window).scroll(function () {
    let scroll_len = $(window).scrollTop();
    if (scroll_len > 120) {
        $('.top').fadeIn();
    } else {
        $('.top').fadeOut();
    }
});

function goTop() {
    $("body,html").animate({scrollTop: 0}, 300);
}