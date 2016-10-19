<div class="wrap product-detail-wrap" data-widget="hybrid/app/mall/product_detail.js#buyForm">
<form data-role="form">
<% if (data) { %>
    <section class="product-basic-msg">
        <div class="product-pic-box" data-widget="hybrid/common/lib/slide/responsiveBanner.js" data-interval="10000">
            <ul class="product-list" data-role="list" id="product_list" data-widget="hybrid/app/mall/product_detail.js#topImgLazyload">
                <% if (data.images.length > 0){%>
                    <% data.images.forEach(function(item) {%>
                        <li data-role="item">
                            <img data-original="<%= item %>?imageView2/1/w/750" src="/dj/hybrid/app/mall/img/1px_png.png" alt="">
                        </li>
                    <% }) %>
                <% } %>
            </ul>

            <input type="hidden" name="merchant_id" value="<%= data.merchant_id %>">
            <input type="hidden" name="merchandise_id" value="<%= data.id %>">
            <input type="hidden" name="merchant_name" value="<%= data.merchant_name %>">
            <input type="hidden" name="merchandise_avatar" value="<%= data.images[0] + '?imageView2/1/w/160' %>">
            <input type="hidden" name="merchandise_name" value="<%= data.name %>">
            <input id="input_price" type="hidden" name="merchandise_price" value="<%= data.price %>">
            <input type="hidden" name="logistic_fee" value="<%= data.logistic_fee %>">

            <div class="float-tip discount-box" data-widget="hybrid/app/mall/product_detail.js#timeCountDown" style="display: none;">
                <i class="i-clock"></i>
                <span data-role="countDownText">距特卖结束还剩：0天00时00分00秒</span>
            </div>
            <div class="float-tip page-box" data-widget="hybrid/app/mall/product_detail.js#responsiveText" data-list="#product_list">
                <span data-role="curPage">1</span>/<span data-role="allPage"></span>
            </div>
            <!-- <a class="cart-time-tip" href="javascript:void(0)">
                <span><i>1</i></span>
                19:52
            </a> -->
            <% if(data.status === '0') {%>
                <div class="sold-out active">
                    <div class="sold-out-tip">未上架</div>
                </div>
            <% } %>
            <% if(data.status === '2') {%>
                <div class="sold-out active">
                    <div class="sold-out-tip">已下架</div>
                </div>
            <% } %>

        </div>
        <h2 class="product-title"><%= data.name %></h2>
        <div class="product-price-box">

            <span class="temaijia" style="display: none;">限时特卖</span>

            <span data-role="discount" data-old-price="<%= data.price_range %>" class="discount-price">
                <% if(data.price_range && data.price_range !== '') {%>
                    ¥ <%= data.price_range %>
                <% }else{ %>
                    ¥ <%= data.price %>
                <% } %>
            </span>

            <% if(data.original_price && data.original_price !== '0') { %>
                <span class="original-price">¥ <%= data.original_price %></span>
            <% } %>

            <% if(data.price_range && data.original_price && data.original_price !== '0' && parseFloat(data.price_range) < parseFloat(data.original_price)) { %>
                <span class="discount-percent thin-border"><%= (data.price_range/data.original_price*10).toFixed(1) %>折</span>
            <% } %>

            <% if(!data.price_range && data.price && parseFloat(data.price) < parseFloat(data.original_price)){ %>
                <span class="discount-percent thin-border"><%= (data.price/data.original_price*10).toFixed(1) %>折</span>
            <% } %>

            <span class="dispatch-way">
                <% if(data.logistic_fee && data.logistic_fee > 0){ %>
                    邮费<%= data.logistic_fee %>元
                <% }else{ %>
                    包邮
                <% } %>
            </span>
        </div>

        <div class="sale-end-tip" style="display: none;">
            <i class="i-sale-end"></i>
            <span class="arr-sale-end"></span>
            特卖结束后，恢复<em>¥ <%= data.original_price %></em>
        </div>

        <div class="product-other-msg">
            <span class="sold-num">已售<%= (data.sold_quantity && parseInt(data.sold_quantity, 10) >= 0) ? parseInt(data.sold_quantity, 10)+1 : 1 %></span>
            <span class="product-position"><%= data.province %><%= data.city %></span>
        </div>
    </section>
    <section class="logistic-coupon-box">
        <% if(data.logistic_strategy==='1' && data.logistic_free_list && data.logistic_free_list.length > 0){ %>
            <div class="discount-msg-box" data-role="showLogistic">
                <span class="discount-title">促</span>
                <span class="discount-desc">1.<%= data.logistic_free_list[0] %></span>
                <i></i>
            </div>
            <hr class="sm-line">
        <% } %>
        <% if(data.discount_list && data.discount_list.length > 0){ %>
            <div class="discount-msg-box">
                <a class="a-discount" data-href="http://<%= window.location.host %>/index.html#mall/store_coupon?param=<%= encodeURIComponent( JSON.stringify({merchant_id:data.merchant_id}) ) %>" href="javascript:;" data-role="btnCoupon">
                    <span class="discount-title">券</span>
                    <span class="discount-desc">
                    <% data.discount_list.forEach(function(item, index){ %>
                        <% if(index < 3){ %>
                            <%= item.data.condition.amount === '' ? '下单立减'+item.data.affect_amount+'元' : '满'+ item.data.condition.amount +'元减'+ item.data.affect_amount+'元'%>
                            &nbsp
                        <% } %>
                    <% }) %>
                    </span>
                </a>
                <i></i>
            </div>
        <% } %>
    </section>
    <section class="product-option-box" data-widget="hybrid/app/mall/product_detail.js#skuHandel" data-sku-info="<%= encodeURI(JSON.stringify(data.sku_info_map || [])) %>">
        <% data.attributes && data.attributes.forEach(function(item, index){%>
            <% if(item.name !== ''){ %>
                <div class="option-choose" >
                    <div class="option-title">选择<%= item.name %></div>
                    <div class="option-items-box"
                        data-role="attributesBox"
                        id="_attr_<%= index %>">
                        <% item.values && item.values.forEach(function (val){%>
                            <span data-index="<%= index %>"
                                class="option-item thin-border <%= data.status==='1' ? '' : 'disabled' %>"
                                data-role="<%= data.status==='1' ? 'optItem' : '' %>"
                                data-value="<%= item.name %>:<%= val %>">
                                <%= val %>
                                <% if(item.has_images){ %>
                                    <span class="item-preview-box">
                                        <img src="<%= item.images[val] %>?imageView2/1/w/140" alt="">
                                        <i></i>
                                    </span>
                                <% } %>
                            </span>
                        <%})%>
                    </div>
                    <hr class="sm-line">
                </div>
            <% } %>
        <%})%>
        <input type="hidden" data-sku-map='<%= JSON.stringify(data.sku_info_map) %>' data-attrs='<%= JSON.stringify(data.attributes) %>' name="attributes" value='' data-role="inputAttributes">
        <div class="option-choose">
            <div class="option-title">选择数量</div>
            <div class="option-items-box">
                <span class="option-item option-item-num thin-border" data-widget="hybrid/app/mall/product_detail.js#quantityHandel">
                    <span class="q-btn btn-reduce thin-border active" data-role="reduceBtn">-</span>
                    <!-- <span class="num-c" data-role="numBox">1</span> -->
                    <input type="text" class="num-c" name="quantity" data-role="numBox" value="1" maxlength="2" readonly="readonly" >
                    <span class="q-btn btn-add thin-border <%= data.status==='1' ? '' : 'active' %>" data-role="addBtn">+</span>
                </span>
            </div>
        </div>
    </section>
    <section class="store-msg">
        <div class="store-detail">
            <img class="store-logo" src="<%= data.merchant_avatar %>" alt="">
            <div class="store-text">
                <div class="store-name"><%= data.merchant_name %></div>
                <div class="store-pos">
                    <%= data.merchant_province ? data.merchant_province : '' %>
                    <%= data.merchant_city ? data.merchant_city : '' %>
                </div>
            </div>
        </div>
        <div class="store-rule">
            <i></i>7天无理由退货
            <i></i>24小时发货
            <i></i>交易保障
        </div>
        <div class="bot-btn-box">
            <a data-att-id="nativeA" href="http://<%= window.location.host %>/index.html?date=<%= Date.now() %>#mall/store?id=<%= data.merchant_id %>" class="bot-btn btn-all-products thin-border">全部商品</a>
            <a data-att-id="nativeA" href="http://<%= window.location.host %>/index.html?date=<%= Date.now() %>#mall/store?id=<%= data.merchant_id %>" class="bot-btn btn-into-store thin-border">进入店铺</a>
        </div>
    </section>
    <!-- <div id="drop_down_tip" class="drop-down-tip active">
        <hr class="sm-line">
        <div class="drop-down-text">继续拖动，查看图文详情</div>
    </div> -->

    <!-- <div id="drop_up_tip" class="drop-down-tip up">
        <hr class="sm-line">
        <div class="drop-down-text">下拉，返回商品详情</div>
    </div> -->
    <section id="product_detail_content" class="product-detail-content ">
        <div class="product-c-tab">
            <span>图文详情</span>
        </div>
        <hr class="sm-line">
        <div id="image_text" class="product-image-text">
            <!-- 图文详情 -->
        </div>
    </section>
    <section class="action-bar">
        <hr class="sm-line top">
        <% if(data.merchant_user_id) { %>
            <a class="action-item suport" href="javascript:void(0)" data-widget="hybrid/app/mall/product_detail.js#loadChat" data-user-id="<%= data.merchant_user_id %>" data-merchant-id="<%= data.merchant_id %>">
                <i></i>
                <div class="action-desc">客服</div>
            </a>
        <% } %>
        <!-- <a class="action-item collect active" href="javascript:void(0)">
            <i></i>
            <div class="action-desc">收藏</div>
        </a> -->
        <a data-att-id="nativeA" class="action-item into-store" href="http://<%= window.location.host %>/index.html?date=<%= Date.now() %>#mall/store?id=<%= data.merchant_id %>">
            <i></i>
            <div class="action-desc">进店</div>
        </a>
        <% if(data.status !== '1') { %>
            <button class="btn-buy disabled" type="submit" data-role="submit" disabled="disabled" style="background-color: #999">立即购买</button>
            <a class="btn-push-shopcar" href="javascript:void(0)" style="background-color: #999">加入购物车</a>
        <% }else{ %>
            <button class="btn-buy" type="submit" data-role="submit" >立即购买</button>
            <a class="btn-push-shopcar" data-role="addCart" href="javascript:void(0)">加入购物车</a>
        <% } %>

    </section>
<% }else{ %>
    <div style="display: table; width: 100%; position: absolute;height: 80%;">
           <p style="display: table-cell;vertical-align: middle;text-align: center; ">商品已下架～</p>
    </div>
<% } %>
</form>
<section id="coupon_mask" class="coupon-mask" data-role="couponMask">
</section>
<section class="coupon-content" data-role="couponContent">
    <div class="order-coupon-box">
        <div class="order-coupon-title"><span>店铺优惠</span></div>

        <ul class="logistic-condition-list">
            <% data.logistic_free_list && data.logistic_free_list.length > 0 && data.logistic_free_list.forEach(function(item, index){ %>
            <li>
                <%= (index+1) + '.' + item %>
            </li>
            <% }) %>
        </ul>

        <div class="done-btn-box" data-role="closeMask">
            <div>完成</div>
        </div>
    </div>
</section>
</div>
