<% var defautAvatar = '/dj/hybrid/app/bbs/img/user_photo.png' %>
<div data-pid="<%= item.id %>" data-rp-ua="<%= item.created_username %>" class="replies-item">
    <img class="user-avatar" src="<%= item.created_useravatar || defautAvatar %>" alt="">
    <div class="replies-detail-box">
        <div class="reply-content">
            <span class="comment-name">
                <%= item.created_username %><% if (item.created_userid === author_id) { %><em>楼主</em><%} %>
                <% if ('1' === operateReply.delete) { %>
                    <span data-role="del" class="delete-btn delete-btn-comment">删除</span>
                <% } %>
            </span>
            <% if (item.reply_tid) { %>
            <span class="replies-comment">
                <%= item.reply_username %>：<%= item.reply_content %>
            </span>
            <% } %>
            <span class="comment-text">
                <%= item.content %>
            </span>
        </div>
        <div class="replies-time-read">
            <span class="title-time"><%= dateformat(item.created_time * 1000, 'mm-dd HH:MM') %></span>
            <div class="like-reply-btn">
                <span class="padding-dom js-touch-state like-btn <% if (item.is_liked) { %>active<% } %>" data-role="like">
                <em></em>
                <span class="like-text">
                    <%= item.like_count > 0 ? item.like_count : '0' %>
                </span>
                </span>
                <span class="reply-btn js-touch-state"><em></em>回复</span>
            </div>
        </div>
    </div>
</div>
<hr class="sm-line">
