// 注意：每次调用$.get() 或 $.post() $.ajax()会先调用这个函数
// 拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url='http://www.liulongbin.top:3007'+options.url;
    console.log(options.url);
})