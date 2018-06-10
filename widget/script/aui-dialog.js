/**
 * aui-popup.js
 * @author 娴佹氮鐢�
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window, undefined) {
    "use strict";
    var auiDialog = function() {};
    var isShow = false;
    auiDialog.prototype = {
        params: {
            title: '',
            msg: '',
            buttons: ['取消', '确认'],
            input: false
        },
        createMsg: function(params, callback) {
            var self = this;
            var dialogHtml = '';
            var buttonsHtml = '';
            var headerHtml = params.title ? '<div class="aui-dialog-header">' + params.title + '</div>' : '<div class="aui-dialog-header">' + self.params.title + '</div>';
            var msgHtml = params.msg ? '<div class="aui-dialog-body">' + params.msg + '</div>' : '<div class="aui-dialog-body">' + self.params.msg + '</div>';
            var buttons = params.buttons ? params.buttons : self.params.buttons;
            if (buttons && buttons.length > 0) {
                for (var i = 0; i < buttons.length; i++) {
                    buttonsHtml += '<div class="aui-dialog-btn" tapmode button-index="' + i + '">' + buttons[i] + '</div>';
                }
            }



            var footerHtml = '<div class="aui-dialog-footer">' + buttonsHtml + '</div>';
            dialogHtml = '<div class="aui-dialog">' + headerHtml + msgHtml + footerHtml + '</div>';
            document.body.insertAdjacentHTML('beforeend', dialogHtml);
            // listen buttons click
            var dialogButtons = document.querySelectorAll(".aui-dialog-btn");
            if (dialogButtons && dialogButtons.length > 0) {
                for (var ii = 0; ii < dialogButtons.length; ii++) {
                    dialogButtons[ii].onclick = function() {
                        if (callback) {

                            callback({
                                buttonIndex: parseInt(this.getAttribute("button-index")) + 1
                            });

                        };
                        self.close();
                        return;
                    }
                }
            }
            self.open();
        },
        create: function(params, callback) {
            var self = this;
            var dialogHtml = '';
            var buttonsHtml = '';
            var headerHtml = params.title ? '<div class="aui-dialog-header">' + params.title + '</div>' : '<div class="aui-dialog-header">' + self.params.title + '</div>';
            if (params.input) {
                params.text = params.text ? params.text : '';
                params.thevalue = params.thevalue ? params.thevalue : '';
                var msgHtml = '<div class="aui-dialog-body"><input type="text" class="theInput" placeholder="' + params.text + '" value="' + params.thevalue + '" /></div>';
            } else {
                var msgHtml = params.msg ? '<div class="aui-dialog-body">' + params.msg + '</div>' : '<div class="aui-dialog-body">' + self.params.msg + '</div>';
            }
            var buttons = params.buttons ? params.buttons : self.params.buttons;
            if (buttons && buttons.length > 0) {
                for (var i = 0; i < buttons.length; i++) {
                    buttonsHtml += '<div class="aui-dialog-btn" tapmode button-index="' + i + '">' + buttons[i] + '</div>';
                }
            }



            var footerHtml = '<div class="aui-dialog-footer">' + buttonsHtml + '</div>';
            dialogHtml = '<div class="aui-dialog">' + headerHtml + msgHtml + footerHtml + '</div>';
            document.body.insertAdjacentHTML('beforeend', dialogHtml);
            if (params.title == "充值金额") {
                $(".theInput").keyup(function(th) {
                    var regStrs = [
                        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
                        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
                        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
                        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
                    ];
                    for (i = 0; i < regStrs.length; i++) {
                        var reg = new RegExp(regStrs[i][0]);
                        $(this).val($(this).val().replace(reg, regStrs[i][1]));
                        // th.value = th.value.replace(reg, regStrs[i][1]);
                    }
                }).blur(function(th) {
                    var v = $(this).val();
                    if (v === '') {
                        v = '0.00';
                    } else if (v === '0') {
                        v = '0.00';
                    } else if (v === '0.') {
                        v = '0.00';
                    } else if (/^0+\d+\.?\d*.*$/.test(v)) {
                        v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
                        v = inp.getRightPriceFormat(v).val;
                    } else if (/^0\.\d$/.test(v)) {
                        v = v + '0';
                    } else if (!/^\d+\.\d{2}$/.test(v)) {
                        if (/^\d+\.\d{2}.+/.test(v)) {
                            v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
                        } else if (/^\d+$/.test(v)) {
                            v = v + '.00';
                        } else if (/^\d+\.$/.test(v)) {
                            v = v + '00';
                        } else if (/^\d+\.\d$/.test(v)) {
                            v = v + '0';
                        } else if (/^[^\d]+\d+\.?\d*$/.test(v)) {
                            v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
                        } else if (/\d+/.test(v)) {
                            v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
                            ty = false;
                        } else if (/^0+\d+\.?\d*$/.test(v)) {
                            v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
                            ty = false;
                        } else {
                            v = '0.00';
                        }
                    }
                    $(this).val(v)
                        //  th.value = ;
                });

            }

            // listen buttons click
            var dialogButtons = document.querySelectorAll(".aui-dialog-btn");
            if (dialogButtons && dialogButtons.length > 0) {
                for (var ii = 0; ii < dialogButtons.length; ii++) {
                    dialogButtons[ii].onclick = function() {
                        if (callback) {
                            if (params.input) {
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index")) + 1,
                                    text: document.querySelector(".theInput").value
                                });
                            } else {
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index")) + 1
                                });
                            }
                        };
                        self.close();
                        return;
                    }
                }
            }
            self.open();
        },
        open: function(inde) {
            if (inde == undefined) {
                inde = 2
            }
            if (!document.querySelector(".aui-dialog")) return;
            var self = this;
            document.querySelector(".aui-dialog").style.marginTop = "-" + Math.round(document.querySelector(".aui-dialog").offsetHeight / inde) + "px";
            if (!document.querySelector(".aui-mask")) {
                var maskHtml = '<div class="aui-mask"></div>';
                document.body.insertAdjacentHTML('beforeend', maskHtml);
            }
            // document.querySelector(".aui-dialog").style.display = "block";
            setTimeout(function() {
                document.querySelector(".aui-dialog").classList.add("aui-dialog-in");
                document.querySelector(".aui-mask").classList.add("aui-mask-in");
                document.querySelector(".aui-dialog").classList.add("aui-dialog-in");
            }, 10)
            document.querySelector(".aui-mask").addEventListener("touchmove", function(e) {
                e.preventDefault();
            })
            document.querySelector(".aui-dialog").addEventListener("touchmove", function(e) {
                e.preventDefault();
            })
            return;
        },
        close: function() {
            var self = this;
            document.querySelector(".aui-mask").classList.remove("aui-mask-in");
            document.querySelector(".aui-dialog").classList.remove("aui-dialog-in");
            document.querySelector(".aui-dialog").classList.add("aui-dialog-out");
            if (document.querySelector(".aui-dialog:not(.aui-dialog-out)")) {
                setTimeout(function() {
                    if (document.querySelector(".aui-dialog")) document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
                    self.open();
                    return true;
                }, 200)
            } else {
                document.querySelector(".aui-mask").classList.add("aui-mask-out");
                document.querySelector(".aui-dialog").addEventListener("webkitTransitionEnd", function() {
                    self.remove();
                })
                document.querySelector(".aui-dialog").addEventListener("transitionend", function() {
                    self.remove();
                })
            }
        },
        remove: function() {
            if (document.querySelector(".aui-dialog")) document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
            if (document.querySelector(".aui-mask")) {
                document.querySelector(".aui-mask").classList.remove("aui-mask-out");
            }
            return true;
        },
        alert: function(params, callback) {
            var self = this;
            return self.create(params, callback);
        },
        alertMsg: function(params, callback) {
            var self = this;
            return self.createMsg(params, callback);
        },
        prompt: function(params, callback) {
            var self = this;
            params.input = true;
            return self.create(params, callback);
        },
        discount: function(params, callback) {
            var self = this;
            return self.creatediscount(params, callback);
        },
        creatediscount: function(params, callback) {
            var self = this;
            var dialogHtml = '';
            var buttonsHtml = '';
            var auiDialogStyle = '';
            var inde = 2;
            var headerHtml = params.title ? '<div class="aui-dialog-header">' + params.title + '</div>' : '<div class="aui-dialog-header">' + self.params.title + '</div>';
            if (params.discount) {
                auiDialogStyle = "background:transparent"
                var msgHtml = params.msg ? '<div class="aui-dialog-body"><img id="discountImg" src=' + params.msg + ' style="width: 100%;"></div>' : '<div class="aui-dialog-body">' + self.params.msg + '</div>';

            } else {
                var msgHtml = params.msg ? '<div class="aui-dialog-body">' + params.msg + '</div>' : '<div class="aui-dialog-body">' + self.params.msg + '</div>';
            }
            var buttons = params.buttons ? params.buttons : self.params.buttons;
            if (buttons && buttons.length > 0) {
                for (var i = 0; i < buttons.length; i++) {
                    buttonsHtml += '<div class="aui-dialog-btn" tapmode button-index="' + i + '">' + buttons[i] + '</div>';
                }
            }
            if (params.discount) {
                buttonsHtml = '<div class="aui-dialog-btn" tapmode button-index="' + i + '"><img src=' + params.closeImg + ' style="width: 2.5rem;    float: right;  padding-right: 1rem;    padding-top: 10px;"></div>'
                var footerHtml2 = '<div>' + buttonsHtml + '</div>';
                // var footerHtml = footerHtml2;
                var headerHtml = footerHtml2
                var footerHtml = "";
                inde = 1.5
            } else {
                var footerHtml = '<div class="aui-dialog-footer">' + buttonsHtml + '</div>';
                inde = 2
            }
            dialogHtml = '<div class="aui-dialog" style="' + auiDialogStyle + '">' + headerHtml + msgHtml + footerHtml + '</div>';
            document.body.insertAdjacentHTML('beforeend', dialogHtml);

            // listen buttons click
            var discountImg = document.getElementById("discountImg");
            if (discountImg != null) {
                discountImg.onclick = function() {
                    $common.openWin('thirdHead', {
                        title: '',
                        key: 'OutUrl',
                        FrameName: 'http://help.t-ke.cn/web/#/2?page_id=73'
                    });
                }
            }
            var dialogButtons = document.querySelectorAll(".aui-dialog-btn");
            if (dialogButtons && dialogButtons.length > 0) {
                for (var ii = 0; ii < dialogButtons.length; ii++) {
                    dialogButtons[ii].onclick = function() {
                        if (callback) {
                            if (params.input) {
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index")) + 1,
                                    text: document.querySelector(".theInput").value
                                });
                            } else {
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index")) + 1
                                });
                            }
                        };
                        self.close();
                        return;
                    }
                }
            }
            self.open(inde);
        }
    };
    window.auiDialog = auiDialog;
})(window);
