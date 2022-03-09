// 注意：每次调用$.get() 或 $.post() $.ajax()会先调用这个函数
// 拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url='http://www.liulongbin.top:3007'+options.url;
    // console.log(options.url);
    // 统一为有权限的接口，设置headers请求头
    if(options.url.indexOf('/my') !== -1){
        options.headers={
            Authorization:localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载 complete函数
    options.complete = function(res){     
            // console.log(res)
            // 拿到服务器响应回来的数据
            if(res.responseJSON.status == 1 && res.responseJSON.message=='身份认证失败！'){
                // 清空taoken
                localStorage.removeItem('token')
                // 跳转到登录页面
                location.href='/login.html'  
        }
    }

})