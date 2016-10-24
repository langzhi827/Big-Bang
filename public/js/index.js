/**
 * Created by harrylang on 16/10/24.
 */
$(function () {
    var isHold = false,
        duration = 100; // 长按时长

    var bangBox = $('.bang-box'),
        bangInner = $('.bang-inner'),
        bangCopy = $('.bang-copy'),
        bangClose = $('.bang-close');
    var container = $('.container');

    // 消息操作
    $('.msg').on('mousedown', function () {
        isHold = true;
        setTimeout((function (elem) {
            return function () {
                if (isHold) {
                    startBang(elem);
                }
            };
        }(this)), duration);
    }).on('mouseup', function () {
        isHold = false;
    }).on('mouseleave', function () {
        isHold = false;
    });

    // 开始爆炸
    function startBang(elem) {
        elem = $(elem);
        var text = elem.text();
        if (!$.trim(text)) {
            return;
        }
        $.post('/bang', {text: text}, function (data) {
            var html = '';
            for (var i = 0, l = data.length; i < l; i++) {
                html += '<div class="bang-label" data-index="' + (i + 1) + '">' + data[i] + '</div>';
            }
            bangInner.html(html);
            container.addClass('bang-scroll');
            bangBox.show();
        });
    }

    // 爆炸操作

    // 关闭
    bangClose.on('click', function () {
        bangBox.hide();
        container.removeClass('bang-scroll');
    });

    // 分词选取操作
    bangInner.on('click', '.bang-label', function () {
        var self = $(this);
        self[self.hasClass('bang-active') ? 'removeClass' : 'addClass']('bang-active');
    });

    // 复制
    ZeroClipboard.config({
        moviePath: '/js/zeroclipboard-2.2.0/ZeroClipboard.swf'
    });
    var clip = new ZeroClipboard(bangCopy);
    clip.on('beforecopy', function () {
        var text = '';
        var actves = $('.bang-active');
        for (var i = 0, len = actves.length; i < len; i++) {
            text += actves.eq(i).text() + ' ';
        }
        clip.setText(text);
    }).on('aftercopy', function () {
        bangClose.trigger('click');

        alert('复制成功！');
    });


});