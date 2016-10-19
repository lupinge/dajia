<% var user_info = user_info || {}; %>
<div id="address" class="table-mask active"
    data-widget="hybrid/app/misc/zhuanpan/address.js#addressForm">
    <% if(user_info.lottery_result && user_info.award_list && user_info.award_list.length > 0){ %>
    <% var award = user_info.award_list[(user_info.lottery_result - 1 === 5 ? 4 : user_info.lottery_result - 1)] ;%>
        <span class="tip-common">手气不错啊，恭喜抽中</span>
        <span class="tip-prize"><%= award.name %></span>
        <img class="prize-img" src="<%= award.image %>" alt="">
        <span class="table-desc">写下你的收货信息吧，要保持手机畅通哦~</span>
        <form data-role="form">
            <div class="table-input">
                <input name="lottery_class" type="hidden" value="<%= user_info.lottery_result %>">
                <input name="name" type="text" placeholder="请输入收货人姓名（必填）"
                data-rules='[["required","姓名不能为空"]]'
                value="<%= user_info.name || '' %>"
                >

                <hr class="sm-line">
                <input name="phone" type="tel" placeholder="请输入收货人手机号（必填）"
                data-rules='[["required","手机号不能为空"],["phone","手机格式不对"]]'
                value="<%= user_info.phone || '' %>"
                ><hr class="sm-line">
                <input name="address" type="text" placeholder="请输入收货地址（必填）"
                data-rules='[["required","收货地址不能为空"]]'
                value="<%= user_info.address || '' %>"
                ><hr class="sm-line">
                <input name="qq" type="text" placeholder="请输入QQ或微信号（选填）"
                value="<%= user_info.qq || '' %>"
                ><hr class="sm-line">
            </div>
            <div class="dialog-bar mt25">
                <button type="submit" data-role="submit" data-action="yes" class="btn btn-confirm">提交</button>
            </div>
        </form>
    <% } else { %>
        <span class="tip-common">没有抽中的奖品～</span>
    <% } %>

</div>