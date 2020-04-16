$(document).ready(function(){
    index.init()
})

let index = {
    init(){
        index.initDom()
    },
    initDom(){
        let that = this
        that.list = mockData.result.list
        // mock操作不涉及ajax请求故需单独运行挂载子项函数
        index.appendDom(that)
        let url = "http://www.sage.com"
        $.ajax({
            type: "POST",
            url: url,
            data: '',
            dataType: "json",
            crossDomain: true,
            timeout: 20000,
            success: function(res) {
                var res = JSON.parse(res)
                that.list = res.result.list
                console.log(that.list, 'list')
                // 动态挂载各个子项
                index.appendDom(that)
            },
            error: function(e) {
                console.log(e, 'err')
            }
        });
    },
    appendDom(that) {
        let parentDiv = document.getElementById("main-container")
        let content = ''
        $.each(that.list, function(index, item){
            content +=
                    `<div class="main-item inner${index}" data-type="${item.type}" >`
            if (item.isBeta == 1) {
                content += `<img class="beta-img" src="../distVue/img/beta.png" width=65 height=28 alt="beta">`
            }             
            content += `<div class="inner-items">
                            <div class="main-single"><img src="${item.logoPicUrl}" /></div>
                            <div class="big-title">
                                <span>${item.name}</span>
                            </div>
                            <div class="small-title">
                                <span>${item.slogan}</span>
                            </div>
                            <div class="item-desc">
                                <p>${item.desc}</p>
                            </div>`
            if (item.type == 1) {
                content += `<a class="button btn-blue" target="_blank" href="${item.jumpUrl}">立即体验</a>`
            } else if (item.type == 2) {
                content += `<a class="button btn-org" href="javascript:;">立即体验</a>`
            }
            content += `</div>
                        <div class="inner-items-active">
                            <div class="big-title">
                                <span>${item.name}</span>
                            </div>
                            <div class="small-title">
                                <span>${item.slogan}</span>
                            </div>
                            <div class="items-scan">
                                <img src="${item.qrCodePicUrl}" />
                            </div>
                            <p>微信扫码 立即体验</p>
                        </div>
                    </div>`
        })
        content += `<div class="main-item more">
                        <div class="main-single">...</div>
                        <p class="more-item-app">更多应用，敬请期待！</p>
                    </div>`

        parentDiv.innerHTML = content
        index.initEvent()
    },
    initEvent(){
        $(".main-item").on('mouseover',function(){
            addActive($(this).index(), $(this).attr('data-type'))
        })

        $(".main-item").on('mouseout',function(){
            removeActive($(this).index(), $(this).attr('data-type'))
        })
    }
}


 function addActive(index, type) {
    if (type == 2) {
        $(`.main-item.inner${index}`).addClass('active');
    }
}

function removeActive() {
    $('.main-item').removeClass('active');
}
