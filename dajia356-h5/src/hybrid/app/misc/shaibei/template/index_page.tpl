 <% var downloadUrl ='http://m.dajia365.com/downapp'; %>
 <div class="content all-content">
    <img class="index-banner" src="/dj/hybrid/app/misc/shaibei/img/index_banner.png" alt="">
    <div class="activity-desc-box">
        <div class="activity-desc-tab">
            <hr class="sm-line">
            <div class="activity-desc-text">活动说明</div>
        </div>
        <div class="activity-rule-title">一、活动奖品</div>
        <div class="rule-detail-list">
            <p> 1、被喜欢第1名——价值<em>8800元</em>AirProce空气净化器</p>
            <p> 2、被喜欢第2名——价值<em>3280元</em>可灵呐净水器</p>
            <p> 3、被喜欢第3名——价值<em>2599元</em>坚果G1投影仪</p>
            <p> 4、被喜欢第4名——价值355元芬琳黑板漆+价值299元爱耳目家庭摄像头</p>
            <p> 5、被喜欢第5名——价值355元芬琳黑板漆+价值199元丁盯智能门磁</p>
            <p> 6、被喜欢第6名——价值355元芬琳黑板漆</p>
        </div>
        <div class="activity-rule-title">二、参与方式</div>
        <div class="rule-detail-list">
            <p> 1、下载【美家】APP，进入晒呗，晒出你家家居好物（<a data-role="tutor" href="javascript:;">戳这里看教程</a>）</p>
            <p> 2、将你的晒呗分享到微信好友或朋友圈，让小伙伴们进入分享页面后点击喜欢</p>
        </div>
        <div class="detail-rules-box" id="more_rules">
            <div class="activity-rule-title">三、友情提示</div>
            <div class="rule-detail-list">
                <p> 1、活动截止到1月15日18:00，届时将根据被喜欢数公布获奖名单</p>
                <p> 2、同一用户发多条晒呗，按被喜欢数最高帖计入排名</p>
                <p> 3、对于被喜欢数相同的晒呗，按照用户积分进行排名</p>
                <p> 4、有任何问题，可咨询晒呗君（QQ/微信：251371966）</p>
            </div>
        </div>
        <div class="show-rule-detail" data-widget="hybrid/app/misc/shaibei/page/index_page.js#showDetailRules" data-more-rules="#more_rules">查看全部<em></em></div>
    </div>
    <div class="list-content-box">
        <div class="list-desc-tab">
            <hr class="sm-line">
            <div class="list-desc-text">
                <span class="desc-text-b">看看最招人爱的</span>
                <span class="desc-text-s">那些好东西</span>
            </div>
        </div>
        <div class="recommend-box recommend-box-index">
            <ul class="recommend-box-list">
                <% if (data && data.length) { %>
                <% var map  = ['保持住，大奖空气净化器马上到手','顶住，净水器就是你的','加把劲，智能投影仪在召唤','Hold住，智能摄像头谁也抢不走','Hold住，智能门磁谁也抢不走','Hold住，黑板漆谁也抢不走','','','','','',''];%>
                    <% data.forEach(function (item, index) { %>
                        <li>
                            <% var url = is_native ? ('com.youwe.dajia://shaibei/detail/'+ item.id) : downloadUrl  %>
                            <a href="<%= url %>">
                                <img class="recommend-img" src="<%= item.images[0].url%>?imageView2/1/w/180/h/180" alt="">
                            </a>
                            <div class="recommend-detail">
                                <a href="<%= url %>">
                                    <h2><%= item.content %></h2>
                                </a>
                                <div class="like-tip-box">
                                    <div class="like-tip active">
                                        <% if(index === 0) { %>
                                            <em class="active1"></em>
                                        <% } %>
                                        <% if(index === 1) { %>
                                            <em class="active2"></em>
                                        <% } %>
                                        <% if(index === 2) { %>
                                            <em class="active3"></em>
                                        <% } %>
                                        <%= map[index] || '大奖近在咫尺,邀请你的小伙伴们来助力吧！'%>
                                    </div>
                                </div>
                                <div class="author-like-box">
                                    <img src="<%= item.avatar %>" alt="">
                                    <span class="recommend-user-name"><%= item.nickname %></span>
                                    <span data-role="like" data-id="<%= item.id %>" class="recommend-like-num <%= item.is_like ? 'active' : '' %>"><em></em><%= item.like_count %></span>
                                </div>
                            </div>
                        </li>
                    <% });%>
                <% } else { %>
                    <li style="text-align: center">
                        暂无～
                    </li>
                <%} %>


            </ul>
        </div>
        <div class="list-desc-tab type2">
            <hr class="sm-line">
            <div class="list-desc-text">
                <span class="desc-text-b">大奖近在咫尺</span>
                <span class="desc-text-s">邀请你的小伙伴来助力吧</span>
            </div>
        </div>
        <div class="recommend-list-box" data-widget="hybrid/app/misc/shaibei/page/index_page.js#likeList">
            <ul data-role="list" class="recommend-list">
            </ul>
            <div data-role="load" class="loadmore">
                ^……^晒好物赢大奖，你也来晒呗
            </div>
        </div>
    </div>
</div>
<a class="btn-join-activity"
    data-widget="hybrid/app/misc/shaibei/page/index_page.js#join"
    href="<%= is_native ? 'com.youwe.dajia://shaibei/publish/1/晒出家居好物' : downloadUrl %>">
    点击参加活动，大奖抱回家<em></em>
</a>

<div class="content teach-content">
     <!-- <a data-role="close" class="close"><em>+</em></a> -->
    <img class="teach-01" src="/dj/hybrid/app/misc/shaibei/img/teach_01.jpg" alt="">
    <img class="teach-02" src="/dj/hybrid/app/misc/shaibei/img/teach_02.jpg" alt="">
    <img class="teach-03" src="/dj/hybrid/app/misc/shaibei/img/teach_03.jpg" alt="">
    <img class="teach-04" src="/dj/hybrid/app/misc/shaibei/img/teach_04.jpg" alt="">
    <a target="_blank" href="<%= is_native ? 'com.youwe.dajia://shaibei/publish/1/晒出家居好物' : downloadUrl %>" class="btn-open-app btn-teach"
    data-role="pub"
    >立即去发布</a>
</div>
<div id="dialog_dir" class="mask-box">
    <div class="mask-content">
        <a class="mask-handel-item" href="#tutor">
            <img src="/dj/hybrid/app/misc/shaibei/img/i_mask_teach.png" alt="">
            <div class="mask-handel-desc">看教程</div>
            <hr class="sm-line vertical">
        </a>
        <a class="mask-handel-item"  href="com.youwe.dajia://shaibei/publish/1/晒出家居好物">
            <img src="/dj/hybrid/app/misc/shaibei/img/i_mask_show.png" alt="">
            <div class="mask-handel-desc">直接晒</div>
        </a>
    </div>
</div>
