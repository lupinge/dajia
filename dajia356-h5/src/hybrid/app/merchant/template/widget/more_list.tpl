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