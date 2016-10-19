<hr class="sm-line">
<dd>
    <a class="list-item" href="javascript:;"
        data-role="commentItem"
        data-params='<%= JSON.stringify({reply_user_id: data.user_id, nickname:data.nickname, article_id: "<%= $aArticleInfo['id']  %>" , reply_comment_id: data.id, parent_id: data.id }) %>'>
        <div class="media clearfix">
            <div class="media-left">
                <img class="avatar" src="<%= data.avatar %>" height="50" width="50">
            </div>
            <div class="media-body">
                <div class="media-body-header">
                    <span class="time fr"><%= data.time %></span>
                    <span class="username"><%= data.nickname%> <%= (data.author_id === data.user_id) ? ' (作者)' : '' %> <i class="icon icon-font-v"></i></span>
                </div>
                <p class="media-body-content"
                    >

                    <%= data.content %>
                </p>
                <div data-role="replyBox" class="replies-box hide">
                    <i class="replies-top-arrow"></i>

                </div>
            </div>
        </div>
    </a>
</dd>