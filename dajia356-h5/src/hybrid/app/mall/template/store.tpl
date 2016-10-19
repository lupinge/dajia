<div class="wrap store-wrap">
    <section class="store-top-box">
        <img src="<%= data.bg_image %>" alt="" class="store-top-bg">
        <div class="store-top-msg">
            <img src="<%= data.avatar %>" alt="店铺头像" class="store-avatar">
            <div class="store-text store">
                <div class="store-name">
                    <span><%= data.name %></span>
                    <!-- <a href="javascript:;" ></a> -->
                </div>
                <div class="store-pos">
                    <%= data.province ? data.province : '' %>
                    <%= data.city ? data.city : '' %>
                </div>
            </div>
            <!-- <div class="store-collect-box" style="display: none;">
                <div class="collect-num-box">
                    <div class="coll-num">0</div>
                    <div class="coll-text">已收藏</div>
                </div>
                <div class="collect-handel-box">
                    <i class="coll-handel-star "></i>
                    <div class="coll-handel-text">收藏店铺</div>
                </div>
            </div> -->
            <% if(data.user_id) { %>
                <a href="javascript:;" class="btn-store-server" data-widget="hybrid/app/mall/store.js#loadChat" data-user-id="<%= data.user_id %>" data-merchant-id="<%= data.id %>">
                    <i></i>
                    联系卖家
                </a>
            <% } %>
        </div>
    </section>
    <section class="all-product-box" data-widget="hybrid/common/widget/lazyload.js#enableLazyLoad">
        <% if(data.discount_list && data.discount_list.length > 0){ %>
            <div class="store-coupon-box" data-widget="hybrid/app/mall/store.js#navHandel" style="display: block;" data-href="http://<%= window.location.host %>/index.html#mall/store_coupon?param=<%= encodeURIComponent( JSON.stringify({merchant_id:data.id}) ) %>">
                    <ul class="store-coupon-list">
                        <% data.discount_list.forEach(function(item) { %>
                            <li>
                                <div class="coupon-item">
                                    <i class="gray-point top-point"></i>
                                    <i class="gray-point bottom-point"></i>
                                    <i class="i-vertical-line"></i>

                                    <div class="coupon-item-left">
                                        <div class="coupon-item-left-top">¥<%= item.data.affect_amount %></div>
                                        <div class="coupon-item-left-bottom">
                                            <%= item.data.condition.amount === '' ? '无门槛使用' : '满'+ item.data.condition.amount +'元可用'%>
                                        </div>
                                    </div>
                                    <div class="coupon-item-right">
                                        立即<br>领取
                                    </div>
                                </div>
                            </li>
                        <% }) %>
                    </ul>
            </div>
        <% } %>

        <div class="all-product-text">全部商品</div>
        <ul class="tag-list" data-widget="hybrid/app/mall/store.js#loadMore" data-loadmore="#loadmore" data-scroll-able="true" data-merchant-id ="<%= data.id %>">

        </ul>
    </section>
    <div id="loadmore" class="loadmore"><em></em>正在加载...</div>
</div>