<div class="content">
    <% if (current_page <= 1) { %>
        <section>
        <div class="title-box">
            <h2><%= threadInfo.title %></h2>
            <div class="title-detail-box">
                <% var defautAvatar = '/dj/hybrid/app/bbs/img/user_photo.png' %>
                <img class="user-avatar" src="<%= threadInfo.avatar || defautAvatar %>" alt="<%= threadInfo.author_name %>">
                <div class="title-detail-text">
                    <div class="title-name-type">
                        <span class="title-name"><%= threadInfo.author_name %></span>
                        <span class="title-type"><%= threadInfo.fname %></span>
                    </div>
                    <div class="title-time-read">
                        <span class="title-time"><%= dateformat(threadInfo.lastpost_time * 1000, 'mm-dd HH:MM') %></span>
                        <% if ('1' === operateThread.delete) { %>
                            <span data-tid data-role="deletePost" class="delete-btn">删除</span>
                        <% } %>
                        <span class="title-read">阅读 <%= threadInfo.total_click_count %><em></em>回复 <span data-role="commentCount">
                                <%= threadInfo.comment_count %>
                        </span></span>
                    </div>
                </div>
            </div>
        </div>
        <hr class="sm-line">
        <div class="post-content" data-widget="hybrid/common/widget/lazyload.js#enableLazyLoad">
            <%= threadInfo.content %>
        </div>
            <div class="like-box" id="likeBox">
                <% if (lastLikeUsers.length > 0) { %>
                <div class="like-num-box">
                    <span class="like-num"><%= threadInfo.like_count %>人赞</span>
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
            </div>
    </section>
    <% } %>

    <hr class="sm-line">
    <section id="replyList" class="reply-box mt10"
        data-widget="hybrid/app/bbs/page/detail_page.js#replyList"
        data-page='<%= current_page %>'
        data-page-count='<%= page_count %>'
        data-tid="<%= tid %>"
        data-author-id="<%= threadInfo.author_id %>"
        >
        <% if (current_page === 1) {%>
            <hr class="sm-line">
            <div class="replies-title">全部回帖</div>
            <hr class="sm-line">
        <% } %>
        <div class="list-wrap" data-role="listWrap">
        <% if (replyList.length > 0 ) { %>
            <% replyList.forEach(function (item) { %>
                <div class="replies-item" data-rp-ua="<%= item.created_username %>" data-pid="<%= item.id %>">
                    <img class="user-avatar" src="<%= item.created_useravatar || defautAvatar %>" alt="">
                    <div class="replies-detail-box">
                        <div class="reply-content post-content">
                            <span class="comment-name">
                                <%= item.created_username %><% if (item.created_userid === threadInfo.author_id) { %><em>楼主</em><%} %>
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
            <% }); %>
        <% } else { %>
            <div class="none-comment">
                暂无回复～
            </div>
        <% } %>
        </div>
    </section>
    <section class="comment-box" style="display: none;"
        data-widget="hybrid/app/bbs/page/detail_page.js#bottomBar"
        >
        <hr class="sm-line">
        <div class="comment-cont">
            <div data-role="like" data-like-num="<%= threadInfo.like_count %>" data-has-liked="<%= threadInfo.is_liked %>" class="comment-like-btn">
                <em class="like-btn"></em><%= threadInfo.like_count %>
            </div>
            <div data-role="comment" class="comment-write">
                <em class="write-mark"></em>说点什么吧
            </div>

            <div data-role="page" data-page-count="<%= page_count %>" data-page="<%= current_page %>" class="page-box">
            <%= current_page %>/<%= page_count %>页</div>
        </div>
    </section>
<!--     <div class="bottom-nav">
        <ul class="nav-ul">
            <li><a href="javascript:void(0)"><em class="nav-pingce"></em><span>评测</span></a></li>
            <li><a href="javascript:void(0)"><em class="nav-zhaochanpin"></em><span>找产品</span></a></li>
            <li><a href="javascript:void(0)"><em class="nav-shequ"></em><span>社区</span></a></li>
            <li><a href="javascript:void(0)"><em class="nav-gonglve"></em><span>攻略</span></a></li>
            <li><a href="javascript:void(0)"><em class="nav-wo"></em><span>我</span></a></li>
        </ul>
    </div> -->
</div>