<% if (lastLikeUsers.length > 0) { %>
<div class="like-num-box">
    <span class="like-num"><%= like_count %>人赞</span>
    <span class="like-line"><hr class="sm-line"></span>
</div>
    <div class="like-user-box">
        <ul>
            <% lastLikeUsers.forEach(function (item) { %>
                <li><img class="user-avatar" src="<%= item.avatar || defautAvatar %>" alt="<%= item.username %>"></li>
            <% }) %>
        </ul>
    </div>
<% } %>