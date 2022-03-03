$(function () {
    var form = layui.form
    // 密码校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })


    $('.layui-form').on('submit',function (e) {
        // console.log(e)
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('更新用户密码失败！')
                }
                // console.log(res);
                layer.msg('更新密码成功！')
                // 将jquery转为原生js对象。调用reset方法
                $('.layui-form')[0].reset()
            }
        })
    })
})