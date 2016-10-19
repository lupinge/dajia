<div class="order-coupon-box">
    <div class="order-coupon-title"><span>选择优惠券</span></div>
    <% if(data){ %>
        <ul class="order-coupon-list">
            <% data.forEach(function(item, index){ %>
                <li class="order-coupon-item">
                    <%= item.data.condition.amount === '' ? '无门槛使用，下单立减' + item.data.affect_amount + '元' : '满'+ item.data.condition.amount +'元立减' + item.data.affect_amount + '元' %>
                    <input class="pay-way-option coupon-option" type="radio" name="coupon" value="<%= item.id %>" <%= item.id===coupon_id ? 'checked' : ''%> id="coupon_<%= item.id %>">
                </li>
            <% }) %>
            <li class="order-coupon-item">
                暂不使用优惠
                <input class="pay-way-option coupon-option" type="radio" name="coupon" value="0" id="coupon_0">
            </li>
        </ul>
    <% } %>
    <div class="coupon-btn-box">
        <div class="coupon-btn left" data-role="cancelCouponBox"><span>取消</span></div>
        <button type="submit" class="coupon-btn right" ><span>确认</span></button>
    </div>
</div>