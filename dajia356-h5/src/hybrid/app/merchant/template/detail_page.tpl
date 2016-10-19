<div class="content">
    <div class="merchant-detail-score">
        <h1><%= merchant_info['name'] %>
            <% if (merchant_info['hot'] - 0) {  %>
            <span class="merchant-hot">热</span>
            <% } if (merchant_info['top'] - 0) {  %>
            <span class="merchant-top">荐</span>
            <% } if (merchant_info['installable'] - 0) {  %>
            <span class="merchant-zhuang">装</span>
            <% }  %>
        </h1>
        <div class="score-detail clearfix">
            <span class="score-star-icon">
            <%= merchant_info['stars'] %>
            </span>
            <% if (merchant_info['score'] > 0) {  %>
            <span class="merchant-item-score"><%= merchant_info['score'] %></span>
            <span class="merchant-item-review">(<%= merchant_info['comment_count'] %>点评)</span>
            <% } else {  %>
            <span class="merchant-item-review">暂无评论</span>
            <% }  %>
        </div>
        <% if (categories.length > 0) {  %>
        <div class="merchant-item-tag running-category">
            <% categories.forEach (function($sCategory) {  %>
                <span class="red-tag"><%= $sCategory['name'] %></span>
            <% });   %>
            <% brands.forEach ( function($aBrandInfo) {  %>
                <span class="gray-tag"><%= $aBrandInfo['brand_name'] %></span>
            <% });   %>

        </div>
        <% }  %>
    </div>
    <div class="merchant-detail-contact">
        <a href="#" class="contact-address"><i></i><span><%= merchant_info['address'] %></span></a>
        <hr class="sm-line line-nav">
        <div class="phone">
            <i></i>
            <% merchant_info['tel'].forEach (function($tel) { %>
                <% $tel = $.trim($tel) %>
                <% if ($tel) {  %>
            <a href="tel:<%= $tel %>" class="contact-phone"><%= $tel %>
            <em></em>
            </a>
            <hr class="sm-line line-nav">
            <% }});  %>
        </div>
    </div>
    <% if (brands) {  %>
    <div class="merchant-running-brand">
        <!-- <hr class="sm-line line-nav"> -->
        <div class="running-brand-title"> <em></em>
            <span>经营品牌</span>
        </div>
        <% brands.forEach(function($aBrandInfo) {  %>
        <hr class="sm-line line-nav">
        <a class="running-brand-list" href="<%= $aBrandInfo['uri'] %>">
            <img src="<%= $aBrandInfo['image'] %>" alt="<%= $aBrandInfo['brand_name'] %>">
            <div class="running-brand-text">
                <div class="running-brand-text-line"></div>
                <h1><%= $aBrandInfo['brand_name'] %></h1>
                <div class="stars-more">
                    <span class="comment-star-icon">
                        <%= $aBrandInfo['stars'] %>
                    </span>
                    <span class="comment-num"><%= $aBrandInfo['score'] %></span>
                </div>
                <div class="comment-more">
                    <span class="span-slogan"> <em><%= $aBrandInfo['comment_count'] %>人</em>
                        评价
                    </span>
                    <span class="more-brand">
                        品牌详情 <em></em>
                    </span>
                </div>
            </div>
        </a>
        <% });  %>
    </div>
    <% }  %>
    <div class="merchant-comment" id="commentWrap"
        data-widget="hybrid/app/merchant/page/detail_page.js#commentList"
        data-merchant-id="<%= merchant_info['id'] %>"
        data-login-url="/">

            <div class="comment-title"><em></em><span>商家点评</span></div>
            <div class="comment-category" data-role="commentScore">
                <a data-score="0" href="javascript:void(0)" class="active">全部</a>
                <a data-score="3" href="javascript:void(0)">好评(<%= merchant_info['comment_good_count'] %>)</a>
                <a data-score="2" href="javascript:void(0)">中评(<%= merchant_info['comment_medium_count'] %>)</a>
                <a data-score="1" href="javascript:void(0)">差评(<%= merchant_info['comment_bad_count'] %>)</a>
            </div>
            <hr class="sm-line line-nav">

            <div data-role="commentItems" data-merchant-id="<%= merchant_info['id'] %>">

            </div>

    </div>
    <div style="display: none" class="write-comment">
        <!-- <a class="collect">
            <i class="icon-collect active"></i>
            <span>收藏</span>
        </a> -->
        <div class="write-box" data-widget="hybrid/app/merchant/page/detail_page.js#showCommentBox"
            data-refer="#comment-mask"
            data-login-url="/"
            id="commentBox">
            <img src="/dj/hybrid/app/merchant/img/i-write-comment.png" alt="">
            <span>写评论</span>
        </div>
    </div>
</div>

<!-- <div class="comment-mask"
    data-widget="hybrid/app/merhcant/page/detail_page.js#commentControl"
    id="comment-mask"
    data-refer="#commentBox">
    <div class="write-comment-mask">
        <div class="write-comment-title">
            <hr class="comment-sm-line">
            <a class="comment-close-btn" href="javascript:void(0)" data-role="cancel" >取消</a>
            <span class="write-title-text">写评论</span>
            <a class="comment-send-btn" href="javascript:void(0)" data-role="send">发送</a>
            <hr class="comment-sm-line">
        </div>
        <textarea data-role="comment" class="write-comment-text" id="comment-textarea" placeholder="输入评论内容" ></textarea>
    </div>
</div> -->