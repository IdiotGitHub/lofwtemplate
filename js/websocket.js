function websocket(url, userId) {
    let socket;
    if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    } else {
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口 建立连接
        //等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");
        //socket = new WebSocket("http://localhost:8080/websocket/${cid}".replace("http","ws"));
        socket = new WebSocket("ws://" + url + "/websocket/" + userId);
        //打开事件
        socket.onopen = function () {
            console.log("Socket 已打开");
            $(".chat").css("background", "#ff4c0e");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function (msg) {

            let chatContent = $(".messages");
            let msgJson = JSON.parse(msg.data)
            console.log("用户发送数据" + msgJson.toString());
            let message = ' <div class="chatLeft chatContent">' +
                '              <div><span class="contextImg"><img src="' + msgJson.sendUser.userImg + '" alt=""class="userImgSmall"/></span>' +
                '                   <span class="userName">' + msgJson.sendUser.name + '</span>   ' +
                '              </div>' +
                '              <div class="messageLeft">' + msgJson.message + '</div>' +
                '           </div>';
            $(".preM").text(msgJson.message);
            chatContent.append(message);
            ($('.messages').children("div:last-child")[0]).scrollIntoView();
            // $(".messageLeft").css("max-width", $(".messageBord").width() - 100);
            //发现消息进入 开始处理前端触发逻辑
        };
        //关闭事件
        socket.onclose = function () {
            console.log("Socket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
            //此时可以尝试刷新页面
        }
//离开页面时，关闭socket
//jquery1.8中已经被废弃，3.0中已经移除
        // $(window).unload(function(){
// socket.close();
//});
    }
}
