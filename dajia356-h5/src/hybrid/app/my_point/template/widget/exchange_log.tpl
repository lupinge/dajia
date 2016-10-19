<% var stateMap = ['ing', 'success', 'fail'];%>
<% if (data.length) { %>
    <% data.forEach(function (item) {%>
        <li>
            <div class="bill-state-box">
                <span class="apply-state <%=stateMap[item.status]%>"><%= item.status_desc %></span>
            </div>
            <div class="exchange-detail">
                <h2><%=item.merchandise_name%></h2>
                <span class="exchange-condition mt5"><%= dateformat(item.insert_time2 * 1000, 'yy-mm-dd HH:MM') %></span>
            </div>
            <hr class="sm-line list">
        </li>
    <%}); %>
<% } else{%>
<li>
    <p style="padding-top: 20px; text-align: center;color: #999;">还没有兑换过任何奖品噢～</p>
</li>
<% } %>