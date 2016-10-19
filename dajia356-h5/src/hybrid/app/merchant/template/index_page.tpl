<div class="merchant-category">
    <ul class="merchant-category-box" data-widget="hybrid/app/merchant/page/index_page.js#tab">
        <li>
            <a data-role="tab" data-type="0" href="/dj/hybrid/common/index.html?redirect=0#hybrid/app/merchant/page/index_page.js?type=0" class=<%= type == 0 ? 'active':''%>>热门商家</a>
        </li>
        <li>
            <a data-role="tab" data-type="1" href="/dj/hybrid/common/index.html?redirect=1#hybrid/app/merchant/page/index_page.js?type=1" class=<%= type === 1 ? 'active':''%>>建材商家</a>
        </li>
        <li>
            <a data-role="tab" data-type="2" href="/dj/hybrid/common/index.html?redirect=2#hybrid/app/merchant/page/index_page.js?type=2" class=<%= type === 2 ? 'active':''%>>家居商家</a>
        </li>
    </ul>
    <hr class="sm-line line-nav">
</div>
<div class="content content-index">
    <ul class="merchant-list" id="list">
        <% merchants.forEach ( function (aMerchant) { %>
        <li class="merchant-item">
            <a href="/dj/hybrid/common/index.html?redirect=<%=aMerchant.id %>#hybrid/app/merchant/page/detail_page.js?merchant_id=<%= aMerchant.id %>"
            class="merchant-item-info">
                <h2><%=aMerchant['name']%>
                    <% if (aMerchant['hot'] - 0) { %>
                    <span class="merchant-hot">热</span>
                    <% } if (aMerchant['top'] - 0) { %>
                    <span class="merchant-top">荐</span>
                    <% } if (aMerchant['installable'] - 0) { %>
                    <span class="merchant-zhuang">装</span>
                    <% } %>
                </h2>
                <address><%= aMerchant['address'] %></address>
                <div class="score-detail clearfix">
                    <span class="score-star-icon">
                        <%= aMerchant['stars'] %>
                    </span>
                    <% if (aMerchant['score'] > 0) { %>
                    <span class="merchant-item-score"><%=aMerchant['score']%></span>
                    <span class="merchant-item-review">(<%=aMerchant['comment_count']%>点评)</span>
                    <% } else { %>
                    <span class="merchant-item-review">暂无评论</span>
                    <% } %>
                </div>
                <div class="merchant-item-tag">
                    <% if(aMerchant['product_category'].length > 0) { %>
                        <% aMerchant.product_category.forEach(function(aProductCategory) { %>
                    <span class="red-tag"><%= aProductCategory['name']%></span>
                    <% });} %>
                    <% if (aMerchant['brands'].length > 0) { %>
                        <% aMerchant['brands'].forEach(function(aBrand) { %>
                    <span class="gray-tag"><%=aBrand['brand_name']%></span>
                    <% });} %>
                </div>
            </a>
        </li>
        <hr class="sm-line line-nav">
        <% }); %>
    </ul>
    <% if (type > 0 && more) { %>
    <div class="load-more"
     data-widget="hybrid/app/merchant/page/index_page.js#loadMore"
    data-refor="#list"
    data-type="<%= type %>"
    data-scroll-able="true"
    >
        <span id='loading' data-role="loadMore" class="loading">
            点击查看更多
        </span>
    </div>
    <% } %>
</div>