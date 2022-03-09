$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        // 添加类别
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理形式，绑定form-add事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
    // 通过代理形式，绑定btn-edit事件
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        // console.log(e);
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        })
        // html模板按钮的id传递值到js中
        var id = $(this).attr('data-id')
        //   发起请求获取相应数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // js把添加类别获取到的信息 渲染到 修改分类表单里
                 form.val('form-edit', res.data)
                
            }
        })
    })
    //通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // 拿表单元素的数据!!!!!!
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                // js渲染html
                layer.msg('更新数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
    //    这是提示用户是否要删除
        layer.confirm('确认删除？',{icon:3,title:'提示'},function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    initArtCateList()
                }
            })

        })
    })
})