<% if (data) { %>
<ul class="m-comment-detail">
    <% var i18n = ['','差评','中评', '好评']; %>
    <% var score_class = ['','bad','middle', 'good']; %>
    <% data.forEach(function (item) { %>
    <li data-role="commentItem" data-score="<%= item.score %>">
        <% var defaultAvatar = '/dj/hybrid/app/merchant/img/icon-gray-face.png' %>
        <div class="user-face">
            <img src="<%= !!item.source ? defaultAvatar : item.avatar %>" alt=""></div>
        <div class="comment-content">
            <div>
                <span class="user-name"><%= !!item.source ? item.nickname.substr(0, 2) + '*' : item.nickname %> <%= (author_id === item.user_id) ? ' (作者)' : '' %></span>
                <span class="comment comment-score-<%= score_class[item.score] %>"><%= i18n[item.score] %></span>
            </div>
            <% if(item['content'].length >= 90) { %>
              <p class="hide" data-role="content">
                <%= item.content %>
              </p>
              <span class="comment-expand js-touch-state" data-role="expand">展开<em></em></span>
            <% } else { %>
              <p><%= item.content %></p>
            <% } %>

            <div class="comment-time">
                <span><%= item.time %></span>
                <% if(item['source'] != ''){ %>
                    <label>来自:</label>
                <% } %>
                <span><%= item.source %></span>
                <div class="comment-operate"> <i class="icon-like"></i>
                    <span class="icon-like-num"><%= item.like_count %></span> <i class="icon-reply"></i>
                    <span class="icon-reply-num"><%= item.child.length %></span>
                </div>
            </div>
        </div>
    </li>
    <hr class="sm-line line-nav">
    <% })%>
    </ul>
<% }; %>