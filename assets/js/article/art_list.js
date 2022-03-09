$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(m) {
        return m > 9 ? m : '0' + m
    }

    // 定义一个查询的参数对象，需要将请求对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable()
    initCate()
    // 获取文章列表数据的
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('获取文章数据失败')
                } layer.msg('获取文章数据成功')
                // 页面渲染页面数据
                var htmlStr = template('tpl-table', res)
                // console.log(res);
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 表单绑定事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新条件 重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage方法渲染分页结构
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页发生切换的触发函数
            // 一直在触发发生死循环
            // 触发jump回调的方式两种
            // 1.点击页码
            // 2.laypage.render()方法就会触发jump回调
            // first如果是true 判断是方式2触发
            jump: function (obj, first) {
                // 当前的页码值
                q.pagenum = obj.curr
                // 根据最新条件 重新渲染表格数据
                // 解决死循环问题
                // 拿到最新条目数
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('是否确认删除？', { icon: 3, titile: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})