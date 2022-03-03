$(function () {
    // 调用函数获取用户基本信息
    getUserInfo();

    var layer = layui.layer
    // 点击按钮，绑定退出函数
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // 请求头配置对象
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息成功')
            }
            // 调用renderAvatat获取用户信息
            renderAvatar(res.data);
        },
        // 无论成功与否 都会调用
     /*    complete: function (res) {
            // console.log(res)
            // 拿到服务器响应回来的数据
            if(res.responseJSON.status == 1 && res.responseJSON.message=='身份认证失败！'){
                // 清空taoken
                localStorage.removeItem('token')
                // 跳转到登录页面
                location.href='/login.html'
            }
        } */
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}

    // 