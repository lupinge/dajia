<% var statusMap = ['','订单已取消','待付款', '支付成功，待发货','已发货','等待退款','订单已完成']%>
<% var refundStatusMap = ['','等待退款','退款成功', '商家拒绝退款','退款失败']%>
<% var count = 0 %>
<% if(data) {%>
<div class="wrap order-detail-wrap">
    <section class="payment-state">
        <%= data.user_status === 5 ? refundStatusMap[data.refund_user_status] : statusMap[data.user_status] %>
        <!-- 买家已付款<span>（你的包裹整装待发）</span> -->
    </section>
    <section class="payment-order">
        <div class="address-display-box">
            <div class="address-name-tel">
                <i></i>
                <span class="address-name">收货人：<%= data.contact_name %></span>
                <span class="address-tel"><%= data.contact_phone %></span>
            </div>
            <div class="address-detail">
                收货地址： <%= data.contact_province + data.contact_city + data.contact_district + data.contact_address %>
            </div>
        </div>
        <hr class="sm-line">
        <% data.merchandise_list.forEach(function(list){ %>
            <% if(list.logistic_no && list.logistic_no !== ''){ %>
                <% list.items.forEach(function(i){ %>
                    <% count += parseInt(i.quantity, 10) %>
                <% }) %>
                <a data-att-id="nativeA" class="logistic-state" href="http://<%= window.location.host %>/index.html#mall/logistic_detail?param=<%= encodeURI( JSON.stringify({seq_no:data.seq_no,merchant_id:list.merchant_id,logistic_status_text:list.logistic_status_text,logistic_type_text:list.logistic_type_text,logistic_no:list.logistic_no,merchandise_quantity:count,merchandise_image:list.items[0].image}) ) %>">
                    <i class="i-logistic-arrow"></i>
                    <div class="recently-position">
                        <i></i>
                        <span><%= list.logistic_message %></span>
                    </div>
                    <div class="recently-state"><%= list.logistic_status_text %></div>
                    <% if(list.logistic_time){ %>
                        <div class="recently-date"><%= dateformat(list.logistic_time * 1000,'yyyy-mm-dd HH:MM:ss') %></div>
                    <% } %>
                </a>
            <% } %>
        <% }) %>
    </section>
    <section class="order-list-box detail">
        <ul class="order-list">
                <% var count = 0; %>
                <li>
                <% data.merchandise_list && data.merchandise_list.forEach(function(md){%>
                    <div class="order-store-msg">
                        <i class="i-store"></i>
                        <span><%= md.merchant_name %></span>
                        <% if(data.user_status === 5){ %>
                            <span class="order-state"><%= refundStatusMap[data.refund_user_status] %></span>
                        <% }else{ %>
                            <span class="order-state"><%= statusMap[data.user_status] %></span>
                        <% } %>
                    </div>
                    <div data-widget="hybrid/app/mall/order_detail.js#createNativeView">
                    <% md.items && md.items.forEach(function (item) {%>
                        <%  count += parseInt(item.quantity, 10)%>
                        <div class="order-product-msg">
                            <a data-id="<%= item.id %>" data-role="item" href="javascript:;">
                                <img src="<%= item.image %>" alt="" class="order-product-pic">
                                <div class="order-product-text">
                                    <div class="order-product-title">
                                        <h2 class="order-product-name">
                                            <%= item.name %>
                                        </h2>
                                        <div class="order-product-qua">
                                            ¥ <%= item.price %> <br>
                                            x<%= item.quantity %>件
                                        </div>
                                    </div>
                                    <div class="order-product-option">
                                        <% var attrs = item.attributes %>
                                        <% attrs && attrs.forEach(function(at){ %>
                                                <%= at.name + '：' + at.value %>
                                            &nbsp;&nbsp;
                                        <% })%>
                                    </div>
                                </div>
                            </a>
                        </div>
                    <%})%>
                    </div>
                    <hr class="sm-line">
                    <div class="order-detail-other">
                        <div class="detail-other-left">
                            运费
                        </div>
                        <div class="detail-other-right">¥<%= md.logistic_fee %></div>
                    </div>
                    <hr class="sm-line">

                    <% if(md.discount_info && md.discount_info.data){ %>
                        <div class="order-detail-other">
                            <div class="detail-other-left">
                                优惠：
                                <%= md.discount_info.data.condition.amount === '' ? '无门槛使用' : '满'+ md.discount_info.data.condition.amount+'元减'+md.discount_info.data.affect_amount+'元' %>
                            </div>
                            <div class="detail-other-right">- ¥<%= md.discount_info.data.affect_amount %></div>
                        </div>
                        <hr class="sm-line">
                    <% } %>

                    <% var refundTime = parseInt((Date.parse(new Date()) - data.finish_time * 1000 ) / 86400000, 10) %>
                    <div class="order-product-desc order-detail"
                         style="<%= (data.user_status === 5 || (data.user_status === 6 && refundTime <= 7)) ? '' : 'text-align: center;'%>">
                        共<%= count %>件商品，实付:
                        <span class="order-p-desc-price">¥ <%= md.total_fee %></span>
                        <span class="order-p-desc-send">(含运费
                            <% if(md.logistic_fee > 0){%>
                                ¥ <%= md.logistic_fee %>
                            <% } else{ %>
                                ¥ 0
                            <% } %>
                        )</span>
                        <% if(data.user_status === 5 || (data.user_status === 6 && refundTime <= 7)) { %>
                            <% if(data.user_status === 5 && (data.refund_user_status === 1 || data.refund_user_status === 2)){ %>
                                <a class="btn-refund thin-border refunding" href="javascript:void(0)">
                                    <%= refundStatusMap[data.refund_user_status] %>
                                </a>
                            <% } %>
                            <% if(data.user_status === 6 || (data.user_status === 5 && (data.refund_user_status === 3 || data.refund_user_status === 4))){ %>
                                <a data-att-id="nativeA" class="btn-refund thin-border refund" href="http://<%= window.location.host %>/index.html#mall/refund?param=<%= encodeURIComponent( JSON.stringify({seq_no:data.seq_no,total_fee:md.total_fee,logistic_fee:md.logistic_fee}) ) %>">
                                    申请退款
                                </a>
                            <% } %>
                        <% }%>
                    </div>
                <%})%>
                <%if(data.user_status == 2){%>
                    <hr class="sm-line">
                    <div data-widget="hybrid/app/mall/order_detail.js#orderHandler"
                        data-param='<%= JSON.stringify({seq_no:data.seq_no}) %>'
                        >
                        <section class="pay-way-box order">
                            <div class="pay-way wechat-pay">
                                <i class="i-pay-way i-wechat"></i>
                                微信支付
                                <input class="pay-way-option " type="radio" name="pay_type" value="2" checked="checked" data-role="wechat">
                            </div>
                            <hr class="sm-line">
                            <div class="pay-way ali-pay">
                                <i class="i-pay-way i-ali"></i>
                                支付宝支付
                                <input class="pay-way-option " type="radio" name="pay_type" value="1" data-role="ali">
                            </div>
                        </section>
                        <div class="order-product-handel">
                            <hr class="sm-line">
                            <a href="javascript:void(0)" data-role="cancelPay" class="order-btn thin-border cancel">取消订单</a>
                            <a href="javascript:void(0)" data-role="pay" class="order-btn thin-border pay">立即付款</a>
                        </div>
                    </div>
                <%}%>
                <% if(data.merchant_user_id) { %>
                    <hr class="sm-line">
                    <div class="order-server">
                        <a href="javascript:;" class="thin-border" data-widget="hybrid/app/mall/order_detail.js#loadChat" data-user-id="<%= data.merchant_user_id %>" data-merchant-id="<%= data.merchandise_list[0].merchant_id %>"><i></i>联系卖家</a>
                    </div>
                <% } %>
                </li>
        </ul>
    </section>
    <section class="order-detail-data">

        <span>订单编号：<%= data.seq_no || '暂无' %></span>
        <span>支付交易号：<%= data.transaction_id || '暂无' %></span>
        <% if(data.insert_time > 0) {%>
            <span>创建时间：<%=dateformat(data.insert_time * 1000,'yyyy-mm-dd HH:MM:ss')%></span>
        <%}%>
        <% if(data.payment_time > 0) {%>
            <span>付款时间：<%= dateformat(data.payment_time * 1000, 'yyyy-mm-dd HH:MM:ss')%></span>
        <%}%>
        <% if(data.shipment_time > 0) {%>
            <span>发货时间：<%= dateformat(data.shipment_time * 1000,'yyyy-mm-dd HH:MM:ss') %></span>
        <%} else {%>
            <span><%= statusMap[data.user_status] %></span>
        <%}%>
        <% if(data.finish_time > 0) {%>
            <span>成交时间：<%= dateformat(data.finish_time * 1000,'yyyy-mm-dd HH:MM:ss') %></span>
        <%}%>

    </section>
</div>
<% } %>