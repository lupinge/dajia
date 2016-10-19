<div class="wrap coupon-wrap" data-widget="hybrid/app/mall/store_coupon.js#pickupCoupon">
<% if(data && data.data.length > 0){ %>
    <ul class="coupon-list" data-widget="hybrid/app/mall/store_coupon.js#loadMore" data-loadmore="#loadmore" data-scroll-able="true">
        <% data.data.forEach(function(item){ %>
            <li class="<%= (item.quantity-item.used_quantity) > 0 && !item.fetched ? '' : 'active' %>" data-role="couponItem" data-coupon-id="<%= item.id %>">
                <div class="top-arr-box"></div>
                <i class="i-gray-point left-point"></i>
                <i class="i-gray-point right-point"></i>
                <div class="store-coupon-left">
                    <div class="store-coupon-money">¥<%= item.data.affect_amount %></div>
                    <div class="store-coupon-condition">
                        <%= item.data.condition.amount === '' ? '无门槛使用，下单立减' : '订单满'+ item.data.condition.amount +'元立减'%>
                    </div>
                </div>
                <div class="store-coupon-right">
                    <div class="text-quan">券</div>
                    <div class="store-coupon-date">
                        <%= dateformat(item.start_time * 1000,'yyyy.mm.dd') %>
                        -
                        <%= dateformat(item.end_time * 1000,'yyyy.mm.dd') %>
                    </div>
                    <div class="btn-coupon-collect">
                        <% if(item.fetched){ %>
                            已领取
                        <% }else{ %>
                            <%= (item.quantity-item.used_quantity) > 0 ? '立即领取' : '已抢光' %>
                        <% } %>
                    </div>
                </div>
            </li>
        <% }) %>
    </ul>
    <div id="loadmore" class="loadmore coupon-list"><em></em>正在加载...</div>
<% }else{ %>
    <div style="display: table; width: 100%; padding: 50% 0;">
        <p style="display: table-cell;vertical-align: middle;text-align: center; ">暂无优惠券～</p>
    </div>
<% } %>
</div>