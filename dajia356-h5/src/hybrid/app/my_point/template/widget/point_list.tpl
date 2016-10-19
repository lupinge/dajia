<% data.forEach(function(item){ %>
    <li>
        <div class="bill-state-box">
            <% if (item.affect < 0) { %>
                <span class="score-state reduce"><%= item.affect %></span>
            <%} else { %>
            <span class="score-state "><%= item.affect == '0'? item.affect : '+' + item.affect %></span>
            <% } %>
        </div>
        <div class="exchange-detail">
            <h2><%= item.descrip %></h2>
            <span class="exchange-condition mt5"><%= dateformat(item.insert_time * 1000, 'yy-mm-dd HH:MM') %></span>
        </div>
        <hr class="sm-line list">
    </li>
<%}) %>