<% if (data.length) { %>
    <% data.forEach(function (item) { %>
    <% var url = item.url ? 'com.youwe.dajia://article/'+ item.id : 'javascript:;' %>
        <li>
        <a href="<%= url %>">
            <img src="<%= item.img %>" alt="<%= item.name %>">
        </a>
        <% var state = ['now','end','pending'];%>
        <div class="commodity-detail-box state-<%= state[item.status - 1] %>">
            <a data-id="<%= item.id %>" href="<%= url %>"><h2><%= item.name %></h2>
            </a>
            <span class="exchange-condition">
            需要: <span class="text-red"><%= item.price %>金币</span>, <%= item.condition %></span>
            <div class="num-exchange-box">
                数量：<%= item.quantity %>
                <span data-status="<%= item.status %>"
                    href="javascript:void(0)"
                    data-name="<%= item.name %>"
                    data-role="<%= state[item.status - 1] %>"
                    data-level="<%= item.level %>"
                    data-id="<%= item.id %>"
                    data-price="<%= item.price %>"
                    class="exchange-btn thin-border thin-border-red exchange-<%= state[item.status -1 ] %>"
                    >
                    <%= item.status != 1 ? item.statusText : '立即兑换'%>
                </span>
            </div>

        </div>
        <hr class="sm-line list">
    </li>
    <% }) %>
<% } %>