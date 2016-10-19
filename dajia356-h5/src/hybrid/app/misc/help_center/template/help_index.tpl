<% var num = ['一、', '二、', '三、', '四、', '五、', '六、', '七、', '八、', '九、', '十、'] %>
<div class="wrap help-index-wrap">
    <% data.forEach(function(item, index){ %>
        <div class="q-title"><%= num[index] + item.first_title %></div>
        <ul class="q-list">
            <% item.children.forEach(function(list, i){ %>
                <li>
                    <a data-att-id="nativeA" href="http://<%= window.location.host %>/index.html?date=<%= Date.now() %>#misc/help_center/help_detail?param=<%= encodeURI( JSON.stringify({first_index:index,second_index:i}) ) %>">
                        <%= list.second_title %>
                        <i></i>
                    </a>
                    <hr class="sm-line">
                </li>
            <% }) %>
        </ul>
    <% }) %>
    <div class="help-bottom-tip">*若以上信息未能解决您的疑问，请联系美家客服。</div>
</div>