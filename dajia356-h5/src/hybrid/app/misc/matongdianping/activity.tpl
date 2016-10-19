<div class="content" data-widget="hybrid/app/misc/matongdianping/activity.js#activity">
    <header>
        <div class="activity-slogan">
            <img class="activity-dpmt" src="/dj/hybrid/app/misc/matongdianping/img/dpmt.png" alt="">
            <img class="img-topic" src="/dj/hybrid/app/misc/matongdianping/img/topic.png" alt="">
        </div>
        <span class="activity-desc">发真实点评即送<em>10元红包</em>，攒人气更可获<em>百元大奖</em></span>
        <a class="btn-rules" href="javascript:void(0)" data-widget="hybrid/app/misc/matongdianping/activity#scrollRules" data-refer="body">详细活动规则<em></em><em></em></a>
        <div class="activity-title-box">
            <span class="activity-title-text">点评马桶热门产品</span>
            <em class="title-triangle"></em>
            <span class="get-three-rmb">发一条真实点评可获得<em>10</em>元</span>
        </div>
    </header>
    <section class="product-list-box" data-role="btnJoin">
        <ul>
            <% data.product_list.forEach (function(item){ %>
                <li data-role="product" data-id="item.id" data-url="product/<%= item.id %>">
	                    <img src="<%= item['images']%>" alt="产品图片">
	                    <h1> <%= item['name']%> </h1>
	                    <div class="comment-box">
	                        <span><%= item['comment_count']%>人参与</span>
	                        <em>点评送10元</em>
	                    </div>
                </li>
            <% }) %>
        </ul>
    </section>
    <section class="matong-brand-box" data-role="btnJoin">
        <span class="find-matong-title">找不到想点评的马桶？看看这些热门品牌吧</span>
        <ul>
            <% data.recommend_list.list.forEach (function(item){ %>
                <li data-role="brand" data-id="item.band_id" data-url="brand/<%= item.category_name %>/<%= item.brand_id%>/product">
                    <div class="brand-img-box"><img src="<%= item['image']%>" alt=""></div>
                    <div class="brand-name"><h1><%= item['brand_alias']%>马桶</h1></div>
                </li>
            <% }) %>
        </ul>
        <span class="more-brand" data-role="showMore" data-url="product_category/matong/马桶/product">
            查看更多马桶品牌与产品
        </span>
    </section>
    <section class="activity-rules" id="activity-rules">
        <table>
            <tr>
                <td>参与方式:</td>
                <td>• 活动期间发表对马桶品牌或产品的真实点评<br>
                • 加入官方活动QQ群（313864847），用昵称验证身份</td>
            </tr>
            <tr></tr>
            <tr>
                <td>奖项设置:</td>
                <td>• 阳光普照奖——发表不少于30字的真实点评，即可获得10元现金红包。<br>
                • 优质点评奖——发表3张以上图片，以及不少于50字的真实点评，获得20元现金红包。<br>
                • 积极参与奖——前50位参与活动并发表有效点评的用户，加送5元现金红包。<br>
                • 人气大奖——活动结束时，将选出20个人气点评，送出100元现金红包。<br>
                • 同一个用户可发表多个点评，但最多只能有两个点评获得奖励。
                </td>
            </tr>
            <tr></tr>
            <tr>
                <td>发奖规则:</td>
                <td>• 每天在微信公众号“装修效果图”和“美家”以及美家网论坛中发布前一天的中奖情况。<br>
                • 加入QQ群（313864847）领奖，同时获取最新活动信息，群主还会不定期发红包哦~
                </td>
            </tr>
        </table>
    </section>
    <footer class="footer-box">
        <span class="copyright-text">本活动最终解释权归美家网所有</span>
        <a class="anyquestion" href="http://bbs.dajia365.com/read-1167.html">如有疑问请查看活动指南<em></em><em></em></a>
    </footer>
    <div class="mask-box" data-role="maskBox">
        <img class="i-arr" src="/dj/hybrid/app/misc/matongdianping/img/i_arr.png" alt="">
        <h1>请按如下步骤打开美家APP</h1>
        <div class="step-box">
            <span class="first-step">1.点击右上角<img class="i-point" src="/dj/hybrid/app/misc/matongdianping/img/i_point.png" alt=""></span>
            <span class="sec-step">2.选择“在浏览器中打开”</span>
        </div>
        <img class="step-tip" src="/dj/hybrid/app/misc/matongdianping/img/i_tip.png" alt="">
    </div>
</div>
