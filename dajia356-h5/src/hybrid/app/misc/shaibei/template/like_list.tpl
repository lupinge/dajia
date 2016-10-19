<% var downloadUrl ='http://m.dajia365.com/downapp'; %>
<% if (data && data.length) { %>
    <% data.forEach(function (item) { %>
        <li>
            <% var url = is_native ? 'com.youwe.dajia://shaibei/detail/'+ item.id : downloadUrl  %>
            <a class="img-box" href="<%= url%>">
                <img class="b-img" src="<%= item.images[0].url %>" alt="">
            </a>
            <a href="<%= url%>">
                <h2><%= item.content %></h2>
            </a>
            <div class="author-like-box author-like-box-index">
                <img src="<%= item.avatar %>" alt="">
                <span class="recommend-user-name"><%= item.nickname %></span>
                <span data-role="like" data-id="<%= item.id %>" class="recommend-like-num <%= item.is_like ? 'active' : '' %>"><em></em><%= item.like_count %></span>
            </div>
        </li>
    <% });%>
<% } else { %>
    <li style="text-align: center">
        暂无～
    </li>
<%} %>
