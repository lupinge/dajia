<div class="content wrap-share">
    <div class="share-title">
        恭喜，您的点评已发布成功，<br>快分享至朋友圈，集赞赢自拍神器吧！
    </div>
    <div class="share-box">
        <div class="user-info">
            <img src="<%= data.avatar%>" alt="" class="user-photo">
            <span class="user-name"><%= data.nickname%></span>
        </div>
        <div class="brand-modle-box">
            <span class="brand-info">品牌：<%= data.brand_name%></span>
            <% if(data.model && data.model !== ''){%>
                <span class="modle-info">型号：<%= data.model%></span>
            <% }%>
        </div>
        <% if(data.score === 3){%>
            <div class="comment-mark-box good">好评</div>
        <% }else if(data.score === 2){%>
            <div class="comment-mark-box middle">中评</div>
        <% }else{%>
            <div class="comment-mark-box bad">差评</div>
        <% }%>
        <div class="comment-text-box">
            <%= data.content.toString()%>
        </div>
        <div class="upload-img-box">
        <% if (data.picture) { %>
            <ul>
            <% data.picture.forEach(function (item) { %>
                <li><img src="<%= item%>" alt=""></li>
             <% }) %>
            </ul>
        <% } %>

        </div>
    </div>
    <a href="javascript:void(0)" class="bot-btn btn-sharewx" data-widget="hybrid/app/misc/youyanji/page/share_page.js#shareTo" data-refer="#btnquit">分享至朋友圈 集赞赢大奖
        <div class="share-mask" data-role="sharemask">
            <div class="share-wx"><img src="/dj/hybrid/app/misc/youyanji/img/share-wx.png" alt="分享到微信"></div>
        </div>
        <div class="share-mask-other" data-role="sharemasksec">
            <div class="share-wx-other"><img src="/dj/hybrid/app/misc/youyanji/img/share-wx2.png" alt="分享"></div>
        </div>
    </a>
    <a href="http://h5.dajia365.com/dj/hybrid/common/index.html?redirect=true#hybrid/app/misc/youyanji/page/index_page.js" class="bot-btn btn-quit" id="btnquit">跳过，放弃奖品</a>
</div>
