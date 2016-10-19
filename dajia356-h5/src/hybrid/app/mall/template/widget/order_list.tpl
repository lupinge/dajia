<% data.forEach(function (sku) { %>
    <li>
        <div class="order-store-msg">
            <i class="i-store"></i>
            <span><%= sku.merchant_name %></span>
        </div>
        <% sku.items && sku.items.forEach(function (product) { %>
            <div class="order-product-msg">
                <img src="<%= product.image %>" alt="商品缩略图" class="order-product-pic">
                <div class="order-product-text">
                    <div class="order-product-title">
                        <h2 class="order-product-name order-confirm">
                            <%= product.name %>
                            <!-- <div class="order-confirm-tag">抢购价</div> -->
                        </h2>
                        <div class="order-product-qua">
                            ¥ <%= product.price %> <br>
                            x<%= product.quantity %>件
                        </div>
                    </div>
                    <div class="order-product-option">
                        <% var attrs = product.attributes %>
                        <% attrs && attrs.forEach(function(item){ %>
                                <%= item.name + '：' + item.value %>
                            &nbsp;&nbsp;
                        <% })%>
                        <!-- 颜色分类:米白色
                        &nbsp &nbsp
                        尺寸:75cm -->
                    </div>
                </div>
            </div>
            <hr class="sm-line">
        <%})%>

        <div class="order-confirm-freight">
            <% var totalFee = 0; %>
            <% sku.items.forEach(function(product){ %>
                <% totalFee += product.total_fee; %>
            <% }); %>
            <% if(sku.logistic_free_condition){%>
                运费：满<%= sku.logistic_free_condition %>包邮
            <% }else if(sku.logistic_fee === '0'){ %>
                运费：店铺包邮
            <% }else{ %>
                运费
            <% } %>
            <div class="confirm-freight-money">¥<%= sku.logistic_fee %></div>
            <% if(sku.logistic_free_condition && (sku.total_fee-sku.logistic_fee) < sku.logistic_free_condition) {%>
                <div class="confirm-freight-tip">还差<%= sku.logistic_free_condition - (sku.total_fee-sku.logistic_fee) %>元可享包邮<i></i></div>
            <% } %>

        </div>
        <hr class="sm-line">

        <% if(sku.discount_info || has_coupon){ %>
            <a class="order-confirm-coupon" href="javascript:;">
                优惠券
                <span class="confirm-available-coupon"><%= coupon_num %>张可用</span>
                <div class="confirm-coupon-arr"></div>
                <div id="affect_amount" class="confirm-coupon-money">
                    <% if(sku.discount_info){ %>
                        - <span><%= sku.discount_info.data.affect_amount %></span>元
                    <% }else{ %>
                        暂不使用优惠
                    <% } %>
                </div>
            </a>
            <hr class="sm-line top">
            <% if(sku.discount_info){ %>
                <input id="coupon_id" type="hidden" name="discount_id" value="<%= sku.discount_info.id %>">
            <% } %>

        <% }else{ %>
            <a class="order-confirm-coupon-none" href="javascript:;">
                优惠券
                <div id="affect_amount" class="confirm-coupon-money" style="color: #999;">
                    暂无可用优惠券
                </div>
            </a>
            <hr class="sm-line top">
        <% } %>
        <div class="order-product-desc">
            共<%= sku.items.length %>件商品，实付:
            <span class="order-p-desc-price">
                  ¥ <%= sku.total_fee %>
            </span>
            <span class="order-p-desc-send">
            （含运费
                <% if(sku.logistic_fee > 0){%>
                    ¥ <%= sku.logistic_fee %>
                <% } else{ %>
                    ¥ 0
                <% } %>
            ）</span>
        </div>
    </li>
<% }); %>