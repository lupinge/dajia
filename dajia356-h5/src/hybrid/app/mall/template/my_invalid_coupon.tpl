<div class="wrap invalid-coupon-wrap">
<% if(data && data.length > 0){ %>
    <ul class="my-coupon-list" data-widget="hybrid/app/mall/my_invalid_coupon.js#loadMore" data-loadmore="#loadmore" data-scroll-able="true">
        <% data.forEach(function(item){ %>
            <li>
                <a href="javascript:;">
                    <div class="my-coupon-title">店铺优惠券</div>
                    <div class="my-coupon-money">¥<span><%= item.data.affect_amount %></span></div>
                    <div class="my-coupon-desc">
                        <div class="my-coupon-store"><%= item.merchant_name %></div>
                        <div class="my-coupon-line"><span><i></i></span></div>
                        <div class="my-coupon-condition">
                            <%= item.data.condition.amount === '' ? '无门槛使用，下单立减' : '满'+ item.data.condition.amount +'元可用'%>
                        </div>
                    </div>
                    <i class="my-coupon-arr"></i>

                    <div class="coupon-point-line-box"><div class="coupon-point-line"></div></div>
                    <div class="my-coupon-date">
                        <%= dateformat(item.start_time * 1000,'yyyy.mm.dd') %>-<%= dateformat(item.end_time * 1000,'yyyy.mm.dd') %>
                    </div>
                </a>
            </li>
        <% })%>
    </ul>
    <div id="loadmore" class="loadmore coupon-list"><em></em>正在加载...</div>
<% }else{ %>
    <div class="none-coupon">
        <div class="none-coupon-icon"></div>
        <div class="none-coupon-tip">还没有失效优惠券哦</div>
    </div>
<% } %>
</div>