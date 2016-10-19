<% var statusMap = ['','订单已取消','待付款', '支付成功，待发货','已发货','等待退款','订单已完成']%>
<% var refundStatusMap = ['','等待退款','退款成功', '商家拒绝退款','退款失败']%>

<% if(data.data.length > 0){ %>
    <% data.data.forEach(function(item){ %>
        <li class="order-list-item">
            <a data-att-id="nativeA"
               href="http://<%= window.location.host %>/index.html#mall/order_detail?param=<%= encodeURI( JSON.stringify({seq_no:item.seq_no}) ) %>">
                <%var count = 0; var logistic_fee = 0;%>
                <% item.merchandise_list.forEach(function(list){ %>
                    <% logistic_fee += parseFloat(list.logistic_fee);%>
                    <div class="order-store-msg">
                        <i class="i-store"></i>
                        <span><%= list.merchant_name %></span>
                        <span class="order-state">
                            <%= item.user_status === 5 ? refundStatusMap[item.refund_user_status] : statusMap[item.user_status] %>
                        </span>
                    </div>
                    <% list.items.forEach(function(pd) { %>
                        <% count += parseInt(pd.quantity, 10) %>
                        <div class="order-product-msg">
                            <img src="<%= pd.image %>" alt="" class="order-product-pic">
                            <div class="order-product-text">
                                <div class="order-product-title">
                                    <h2 class="order-product-name">
                                        <%= pd.name %>
                                    </h2>
                                    <div class="order-product-qua">
                                        <%= pd.price %> <br>
                                        x<%= pd.quantity %>件
                                    </div>
                                </div>
                                <div class="order-product-option">
                                    <% var attrs = pd.attributes %>
                                    <% attrs && attrs.forEach(function(at){ %>
                                            <%= at.name + '：' + at.value %>
                                        &nbsp;&nbsp;
                                    <% })%>
                                </div>
                            </div>
                        </div>
                        <hr class="sm-line">
                    <% }) %>
                <%})%>
                <div class="order-product-desc">
                    共<%= count %>件商品，实付:
                    <span class="order-p-desc-price">¥ <%= item.total_fee %></span>
                    <span class="order-p-desc-send">
                    (含运费
                        <% if(logistic_fee > 0){%>
                            ¥ <%= logistic_fee %>
                        <% } else{ %>
                            ¥ 0
                        <% } %>
                    )</span>
                </div>
                <% if(item.user_status === 2) { %>
                    <div class="order-product-handel"
                                data-widget="hybrid/app/mall/order.js#orderHandler"
                                data-param='<%= JSON.stringify({seq_no:item.seq_no}) %>'>
                        <hr class="sm-line">
                        <a href="javascript:;" data-role="cancelPay" class="order-btn thin-border cancel">取消订单</a>
                        <a href="javascript:;" data-role="pay" class="order-btn thin-border pay">立即付款</a>
                    </div>
                <% } %>
            </a>
        </li>
    <% })%>
<% }else{ %>
    <li style="display: table; width: 100%; padding: 50% 0; background-color: #eee; ">
           <p style="display: table-cell;vertical-align: middle;text-align: center; font-size: 14px;">还没有订单哦～</p>
    </li>
<% } %>