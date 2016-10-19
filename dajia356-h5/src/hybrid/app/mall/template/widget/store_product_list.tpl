<% if (data.data.length > 0){ %>
    <% data.data.forEach(function(item, index) {%>
        <li>
            <a data-role="item" data-id="<%= item.id %>" href="javascript:;">
                <div class="list-img-box">
                    <% var indexs = [0, 1] %>
                    <% if(index in indexs){ %>
                        <img class="tag-list-img" src="<%= item.image %>?imageView2/1/w/400" style="opacity: 1">
                    <% }else{ %>
                        <img class="tag-list-img" data-original="<%= item.image %>?imageView2/0/w/400" src="/dj/hybrid/app/mall/img/1px_png.png">
                    <% } %>
                    <div class="sold-out ">
                        <div class="sold-out-tip">已抢光</div>
                    </div>
                </div>
                <h2><%= item.name %></h2>
            </a>
            <div class="left-time ">还剩7天</div>
            <div class="tag-bar">
                <span class="discount-price">
                    <% if(item.price_range && item.price_range !== '') {%>
                        ¥ <%= item.price_range %>
                    <% }else{ %>
                        ¥ <%= item.price %>
                    <% } %>
                </span>

                <% if (item.original_price && item.original_price !== '0') { %>
                        <span class="original-price">¥ <%= item.original_price %></span>
                <% } %>

                <% if (item.price_range && item.original_price && item.original_price !== '0' && parseFloat(item.price_range) < parseFloat(item.original_price)) { %>
                    <span class="discount-percent thin-border store"><%= (item.price_range/item.original_price*10).toFixed(1) %>折</span>
                <% } %>

                <% if(!item.price_range && item.price && parseFloat(item.price) < parseFloat(item.original_price)){ %>
                    <span class="discount-percent thin-border store"><%= (item.price/item.original_price*10).toFixed(1) %>折</span>
                <% } %>
            </div>
        </li>
    <% }) %>
<% }else{ %>
    <li style="display: table; width: 100%; padding: 50% 0;">
           <p style="display: table-cell;vertical-align: middle;text-align: center; ">商品即将上架～</p>
    </li>
<% } %>