<div class="wrap order-confirm-wrap"
    data-addr-data='<%= JSON.stringify(address) %>'
    data-widget="hybrid/app/mall/order_confirm.js#buyForm">
<form data-role="form">
    <% if (data && data.length > 0) { %>
        <section class="address-box"
                data-widget="hybrid/app/mall/order_confirm.js#addressHandel"
                data-mask="#mask"
                data-role="displayAddress">
                <div class="top-line-box">
                    <div class="top-color-line"></div>
                </div>
                <div data-role="addrWrap">
                    <div class="add-address" data-role="addAddressBox">
                        <a href="javascript:void(0)" data-role="addAddress">+添加地址</a>
                    </div>
                    <input type="hidden" name="contact_addr_id" value="" data-role="addressID">
                </div>
        </section>
        <section class="order-list-box">
            <ul data-role="orderList" class="order-list">

            </ul>
        </section>
        <section class="pay-way-box">
            <div class="pay-way wechat-pay" data-role="payBox">
                <i class="i-pay-way i-wechat"></i>
                微信支付
                <input class="pay-way-option " type="radio" name="pay_type" value="2" checked="checked" data-role="wechat">
            </div>
            <hr class="sm-line">
            <div class="pay-way ali-pay" data-role="payBox">
                <i class="i-pay-way i-ali"></i>
                支付宝支付
                <input class="pay-way-option " type="radio" name="pay_type" value="1" data-role="ali">
            </div>
        </section>
        <section class="pay-bar">
            <hr class="sm-line top">
            <div class="pay-bar-box">
                合计：<span data-role="total">¥ 0</span>
                <button class="btn-buy pay" type="submit" data-role="submit">确认并支付</button>
            </div>
        </section>

    <% }else{ %>
        <div style="display: table; width: 100%; position: absolute;height: 80%;">
               <p style="display: table-cell;vertical-align: middle;text-align: center; ">网络出现问题，请稍后再试～</p>
        </div>
    <% } %>
</form>
<section id="mask" class="mask " data-role="mask">
    <form data-role="addressForm">
    </form>
</section>
<form data-role="couponForm">
    <section id="coupon_mask" class="coupon-mask " data-role="couponMask">
    </section>
    <section class="coupon-content" data-role="couponContent">

    </section>
</form>
</div>