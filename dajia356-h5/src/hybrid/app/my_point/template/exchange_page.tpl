<div id="content" class="content" data-widget="hybrid/app/my_point/page/exchange_page.js#tab">
    <section class="bill-handel">
        <div class="bill-desc">
            <img src="/dj/hybrid/app/my_point/img/i_bill.png" alt="">
            <div class="bill-num-box">
                <span class="bill-num-title">当前金币</span>
                <span class="bill-num-text"><%= credit_info.totalCredit2 %></span>
            </div>
            <a class="get-tip" data-native-url="hybrid/app/my_point/page/member.js?tab=1" href="javascript:;">如何获取金币？</a>
        </div>
        <hr class="sm-line">
        <ul class="bill-tab">
            <li data-type="0" class="active" data-role="billTab">
                <a href="javascript:void(0)">
                    <div class="bill-tab-item">
                        <em class="tab-shop"></em>
                        <span>金币兑换</span>
                        <hr class="sm-line vertical">
                    </div>
                </a>
            </li>
            <li data-type="1" class="" data-role="billTab">
                <a href="javascript:void(0)">
                    <div class="bill-tab-item">
                        <em class="tab-record"></em>
                        <span>兑换记录</span>
                        <hr class="sm-line vertical">
                    </div>
                </a>
            </li>
            <li data-type="2" class="" data-role="billTab">
                <a href="javascript:void(0)">
                    <div class="bill-tab-item">
                        <em class="tab-detail"></em>
                        <span>金币明细</span>
                    </div>
                </a>
            </li>
        </ul>
        <hr class="sm-line">
    </section>
    <section class="bill-list-box">
        <hr class="sm-line top">
        <div class="bill-list-content">
            <div id="store" class="bill-list-tab bill-list-store active" data-role="billItem">
                <div class="top-banner">
                    <img class="top-banner-img" src="/dj/hybrid/app/my_point/img/wx-banner.png" alt="">
                    <div class="top-desc">
                        <em class="i-desc-front"></em>
                        每个月初，我们会精心挑选一批品质家居好物作为兑换礼品，数量有限，先换先得哦~
                        <em class="i-desc-behind"></em>
                    </div>
                </div>
                <hr class="sm-line">
                <ul data-widget="hybrid/app/my_point/page/exchange_page.js#exchange" >
                    <% if (data.length) { %>
                        <% data.forEach(function (item) { %>
                        <% var url = item.url ? 'com.youwe.dajia://article/'+ item.id : 'javascript:;'; %>
                            <li>
                                <a href="<%= url %>">
                                    <img src="<%= item.img %>" alt="<%= item.name %>">
                                </a>
                                <% var state = ['now','end','pending'];%>
                                <div class="commodity-detail-box state-<%= state[item.status - 1] %>">
                                    <a data-id="<%= item.id %>" href="<%= url %>"><h2><%= item.name %></h2>
                                    </a>
                                    <span class="exchange-condition">
                                    需要: <span class="text-red"><%= item.price %>金币</span>, <%= item.condition %></span>
                                    <div class="num-exchange-box">
                                        数量：<%= item.quantity %>
                                        <span data-status="<%= item.status %>"
                                            href="javascript:void(0)"
                                            data-name="<%= item.name %>"
                                            data-role="<%= state[item.status - 1] %>"
                                            data-level="<%= item.level %>"
                                            data-id="<%= item.id %>"
                                            data-price="<%= item.price %>"
                                            class="exchange-btn thin-border thin-border-red exchange-<%= state[item.status -1 ] %>"
                                            >
                                            <%= item.status != 1 ? item.statusText : '立即兑换'%>
                                        </span>
                                    </div>

                                </div>
                                <hr class="sm-line list">
                            </li>
                        <% }) %>
                    <% } else { %>
                        <li>
                            <p style="padding-top: 20px; text-align: center; color: #999;">暂无记录～</p>
                        </li>
                    <% } %>
                </ul>
                <%if (current_page < total_page){ %>
                    <div data-widget="hybrid/app/my_point/page/exchange_page.js#loadMore"
                    data-refer="#store"
                    data-uri='membership/store'
                    class="load-more-box">
                        展开更多<em></em>
                    </div>
                <% } %>
            </div>
        <div id="log"
         class="bill-list-tab bill-list-detail "
         data-role="billItem"
         data-widget="hybrid/app/my_point/page/exchange_page.js#renderLog">
            <ul >
                <li class="none-txt">
                    加载中...
                </li>
            </ul>
            <div  data-widget="hybrid/app/my_point/page/exchange_page.js#loadMore"
            data-role="load_more"
            data-uri='credit_bill/list'
            data-refer="#log"
            class="load-more-box hide">
                展开更多<em></em>
            </div>
        </div>
        <div class="bill-list-tab bill-list-detail "
            data-role="billItem"
            id="coin"
            data-widget="hybrid/app/my_point/page/exchange_page.js#renderCoin">
            <ul>
                <li class="none-txt">
                    加载中...
                </li>
            </ul>
            <div data-widget="hybrid/app/my_point/page/exchange_page.js#loadMore"
            data-role="load_more"
            data-uri='membership/log'
            data-type="2"
            data-refer="#coin"
            class="load-more-box hide" >
                展开更多<em></em>
            </div>
        </div>
    </div>
    </section>
    <div class="dialog dialog-mask ">,
        <div class="dialog-confirm">
            <div class="dialog-body">
                你确定要用100金币兑换伊莱克斯吸尘器112吗？
            </div>
            <div class="dialog-bar">
                <button data-role="btn" data-action="no" class="btn btn-cancel thin-border">取消</button>
                <button data-role="btn" data-action="yes" class="btn btn-confirm">确定</button>
            </div>
        </div>
    </div>

</div>
<div id="address" class="table-mask"
    data-widget="hybrid/app/my_point/page/exchange_page.js#addressForm">
    <span class="table-desc">为了保证奖品准时送达，请准确填写以下信息，并保持手机畅通，方便工作人员联系：</span>
    <form data-role="form">
        <div class="table-input">
            <input type="hidden" name="merchandise_id" value="0">
            <input name="receiver_name" type="text" placeholder="请输入收货人姓名（必填）"
            data-rules='[["required","姓名不能为空"]]'
            >

            <hr class="sm-line">
            <input name="contact" type="tel" placeholder="请输入收货人手机号（必填）"
            data-rules='[["required","手机号不能为空"],["phone","手机格式不对"]]'
            ><hr class="sm-line">
            <input name="address" type="text" placeholder="请输入收货地址（必填）"
            data-rules='[["required","收货地址不能为空"]]'
            ><hr class="sm-line">
            <input name="note" type="text" placeholder="试用产品申请，请输入QQ或微信号（选填）"><hr class="sm-line">
        </div>
        <div class="dialog-bar mt25">
            <button type="button" style="margin-left:0px;" data-role="cancel" data-action="no" class="btn btn-cancel thin-border">取消</button>
            <button type="submit" data-role="submit" data-action="yes" class="btn btn-confirm ml40">确定</button>
        </div>
    </form>
</div>