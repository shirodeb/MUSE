// ==UserScript==
// @name         Make Upload Software Easy
// @namespace    https://appstore-dev.uniontech.com/
// @version      1.0
// @description  Make Uploading Software Easy, an userscript for reduce some bored click in Dev center of UOS.
// @author       Shiroko <hhx.xxm@gmail.com>
// @match        https://appstore-dev.uniontech.com/
// @match        https://appstore-dev.uniontech.com/*
// @icon         https://appstore-dev.uniontech.com/favicon.ico
// @grant none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @resource     https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.css

// ==/UserScript==

(function () {
    'use strict';

    $("head").append (
    '<link '
  + 'href="https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.css" '
  + 'rel="stylesheet" type="text/css">'
);

    const fill_form = async () => {
        console.log("Fill default message");
        $($("[id='ruanj'] label[class*='el-form-item']")[1]).parent().find('[role="radio"]')[0].click();
        await new Promise(r => setTimeout(r, 100));
        $("[id='jiben'] [for='app_fit_info.region']").parent().find('[role="group"]').children('label')[0].click();
        await new Promise(r => setTimeout(r, 100));
        $("[id='jiben'] [for='app_fit_info.region']").parent().find('[role="group"]').children('label')[1].click();
        let t = $("[placeholder='请选择语言']");
        t.trigger('click');
        await new Promise(r => setTimeout(r, 100));
        let v = $("[class*='el-select-dropdown__item']:visible").filter(function () { return ['中文（简体）', '英文'].indexOf($(this).text()) >= 0 });
        await new Promise(r => setTimeout(r, 100));
        v[0].click();
        await new Promise(r => setTimeout(r, 100));
        v[1].click();
        await new Promise(r => setTimeout(r, 100));
        t.trigger('click');
        await new Promise(r => setTimeout(r, 500));
        $("[placeholder='请选择默认语言']").trigger('click');
        await new Promise(r => setTimeout(r, 100));
        $("[class*='el-select-dropdown__item']:visible").filter(function () { return '中文（简体）' === $(this).text() }).trigger('click');
    };

    let fill_form_btn = $(`
    <button>填充默认信息</button>
    `);
    fill_form_btn.css({ 'position': 'absolute', 'left': '1rem', 'bottom': '1rem' });
    fill_form_btn.click(fill_form);

    let copy_info_btn = $(`
    <button>复制信息</button>
    `);
    copy_info_btn.css({ 'position': 'absolute', 'left': '1rem', 'bottom': '3rem' });
    copy_info_btn.click(async () => {
        console.log("Copy info");
        let tab_zh = $("[id='pane-zh_CN'][role='tabpanel']");
        let tab_en = $("[id='pane-en_US'][role='tabpanel']");

        let app_name_selector = '[placeholder="请输入应用名称，60字以内"]';
        let breif_selector = '[placeholder="请输入一句话介绍，100字以内"]';
        let desc_selector = '[placeholder="请输入应用介绍，1000字以内"]';
        let dev_name_selector = '[placeholder="请输入开发者名称，将展示在应用商店详情页"]';

        tab_en.find(app_name_selector)[0].value = tab_zh.find(app_name_selector)[0].value;
        tab_en.find(app_name_selector)[0].dispatchEvent(new Event('input'));
        tab_en.find(breif_selector)[0].value = tab_zh.find(breif_selector)[0].value;
        tab_en.find(breif_selector)[0].dispatchEvent(new Event('input'));
        tab_en.find(desc_selector)[0].value = tab_zh.find(desc_selector)[0].value;
        tab_en.find(desc_selector)[0].dispatchEvent(new Event('input'));
        tab_en.find(dev_name_selector)[0].value = tab_zh.find(dev_name_selector)[0].value;
        tab_en.find(dev_name_selector)[0].dispatchEvent(new Event('input'));
    });

    let open_homepage_btn = $(`
    <button>打开官网</button>
    `);
    open_homepage_btn.css({ 'position': 'absolute', 'left': '1rem', 'bottom': '5rem' });
    open_homepage_btn.click(() => {
        let homepage = $('[placeholder="请输入以http://或https://开头的网址"]').val();
        if (homepage.length > 0)
            window.open(homepage);
    });

    let drop_area = $(`<div ondrop="" ondragover=""><p>Drop info.txt here</p></div>`);
    drop_area.css({ 'position': 'absolute', 'left': '1rem', 'bottom': '7rem' });
    drop_area.css({ 'width': '10rem', 'height': '5rem', 'background': '#1f1f1f1f', 'text-align': 'center' });
    function drag_over_info_file(ev) {
        ev.preventDefault();
    }
    drop_area.on('dragover', drag_over_info_file);
    async function drop_info_file(ev) {
        console.log("File(s) dropped");
        ev = ev.originalEvent;
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        async function process_info_text(content) {
            if ($($("[id='ruanj'] label[class*='el-form-item']")[1]).parent().find('[role="radio"] input')[0].checked === false) {
                await fill_form();
            }
            let lines = content.split('\n');
            if (lines.length >= 4) {
                let name = lines[0].trim();
                let homepage = lines[1].trim();
                let author = lines[2].trim();
                if (author.length === 0) author = `${name} developer(s)`;
                let desc1 = lines[3].trim();
                let desc2 = lines.slice(4).join('\n').trim();
                // fill
                $('[placeholder="请输入以http://或https://开头的网址"]').val(homepage);
                $('[placeholder="请输入以http://或https://开头的网址"]')[0].dispatchEvent(new Event('input'));
                let tab_zh = $("[id='pane-zh_CN'][role='tabpanel']");

                let app_name_selector = '[placeholder="请输入应用名称，60字以内"]';
                $(app_name_selector).val(name);
                $(app_name_selector)[0].dispatchEvent(new Event('input'));
                $(app_name_selector)[1].dispatchEvent(new Event('input'));
                let breif_selector = '[placeholder="请输入一句话介绍，100字以内"]';
                $(breif_selector).val(desc1);
                $(breif_selector)[0].dispatchEvent(new Event('input'));
                $(breif_selector)[1].dispatchEvent(new Event('input'));
                let desc_selector = '[placeholder="请输入应用介绍，1000字以内"]';
                $(desc_selector).val(desc2);
                $(desc_selector)[0].dispatchEvent(new Event('input'));
                $(desc_selector)[1].dispatchEvent(new Event('input'));
                let dev_name_selector = '[placeholder="请输入开发者名称，将展示在应用商店详情页"]';
                $(dev_name_selector).val(author);
                $(dev_name_selector)[0].dispatchEvent(new Event('input'));
                $(dev_name_selector)[1].dispatchEvent(new Event('input'));
            }
        }


        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...ev.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    console.log(`… file[${i}].name = ${file.name}`);
                    if (file.name == "info.txt") {
                        file.text().then(process_info_text);
                    }
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...ev.dataTransfer.files].forEach((file, i) => {
                if (file.name == "info.txt") {
                    file.text().then(process_info_text);
                }
            });
        }
    }
    drop_area.on('drop', drop_info_file);

    let ver_sel_all_btn = $(`<button>选择全部</button>`);
    ver_sel_all_btn.css({ 'position': 'absolute', 'left': '1rem', 'top': '5rem' });
    ver_sel_all_btn.click(async () => {
        let inputs = $("[aria-label='系统版本'] [class*='el-dialog__body'] td[class='td-line'] input[type='checkbox']")
        const allow_list=['专业版', '家庭版', '教育版', '学生版']
        for (let i = 0; i < 5; i++) {
            const name = $(inputs[i]).parent().parent().text().trim()
            if(allow_list.indexOf(name) < 0) continue;
            inputs[i].click();
            await new Promise(r => setTimeout(r, 150));
        }
    });



    const inject_code = () => {
        console.log("Inject UOS Software Upload");
        $('body').append(fill_form_btn);
        $('body').append(copy_info_btn);
        $('body').append(open_homepage_btn);
        $('body').append(drop_area);

        $('[class*="app-main"]').attr('ondrop', '');
        $('[class*="app-main"]').on('drop', drop_info_file);
        $('[class*="app-main"]').on('dragover', drag_over_info_file);

        $('body').click((event) => {
            try {
                if ($(event.originalEvent.target).text() === "系统版本管理") {
                    $("[aria-label='系统版本'] [class*='el-dialog__body']").append(ver_sel_all_btn);
                }
            } catch {
            }
        });

        const blur_btn = $('<button>blur</button>').click(() => {
            let app_name_selector = '[placeholder="请输入应用名称，60字以内"]';
            let breif_selector = '[placeholder="请输入一句话介绍，100字以内"]';
            let desc_selector = '[placeholder="请输入应用介绍，1000字以内"]';
            let dev_name_selector = '[placeholder="请输入开发者名称，将展示在应用商店详情页"]';
            let tab = $("[id='pane-zh_CN'][role='tabpanel']");

            tab.find(app_name_selector)[0].dispatchEvent(new Event('input'));
            tab.find(breif_selector)[0].dispatchEvent(new Event('input'));
            tab.find(desc_selector)[0].dispatchEvent(new Event('input'));
            tab.find(dev_name_selector)[0].dispatchEvent(new Event('input'));

            $.toast('blured');
        });
        setTimeout(() => {
            $('[class="footer-btn"]').append(blur_btn);
        }, 1000);
    };

    $('document').ready(() => {
        // if(window.location.hash === "#/management-detial?type=2")
        // inject_code();
    });

    var run = (url)=> {
       // insert your code here
        console.log(url);
        if(url.startsWith("https://appstore-dev.uniontech.com/#/management-detial"))
        inject_code();
    };

    var pS = window.history.pushState;
    var rS = window.history.replaceState;

    window.history.pushState = function(a, b, url) {
        run(url);
        pS.apply(this, arguments);
    };

    window.history.replaceState = function(a, b, url) {
        run(url);
        rS.apply(this, arguments);
    };

})();