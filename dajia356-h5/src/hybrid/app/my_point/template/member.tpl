<div class="content" data-widget="hybrid/app/my_point/page/exchange_page.js#tab">
    <% var defAvatar = '/dj/hybrid/app/my_point/img/i_out_login.png';%>
    <% var member_requirement_format = member_requirement_format || ''; %>
    <% if (userInfo) {%>
        <section class="member-desc">
            <img src="<%= userInfo.avatar || defAvatar %>" class="user-photo" alt="">
            <div class="user-name-box">
                <%= userInfo.name || userInfo.user_name %><%if(member == '1'){%><img src="/dj/hybrid/app/my_point/img/i_s.png" alt="">
                <%}else {%><img src="/dj/hybrid/app/my_point/img/i_s_fade.png" alt="">
                <%}%>
            </div>
            <div class="user-contribute-text">
                金币
                <em><%= credit_info.totalCredit2 %></em>
                <a class="text-blue" href="javascript:;" data-native-url="hybrid/app/my_point/page/exchange_page.js"> &nbsp; 去兑换 ></a>
                <br>
                <% if (member_requirement_format) {%>
                <%= member_requirement_format.replace('%d', '<em>'+shaibei_count+'</em>') %>
                <%}%>
            </div>
        </section>
    <%} else{ %>
        <section data-widget="hybrid/app/my_point/page/member.js#login" class="member-desc no-login">
            <img src="<%= defAvatar %>" class="user-photo" alt="">
            <div class="user-name-box">
             立即登录
            </div>
            <div class="user-contribute-text">
                查看S会员资格
            </div>
        </section>
    <% } %>
    <hr class="sm-line top">
    <section class="member-content"
        data-widget="hybrid/app/my_point/page/exchange_page.js#tab">
        <hr class="sm-line top">
        <div class="member-tab">
            <div class="member-left active" data-role="billTab">
                <em></em>
                S会员兑换
                <hr class="sm-line vertical"></div>
            <div class="member-right " data-role="billTab">
                <em></em>
                如何成为S会员
            </div>
        </div>
        <hr class="sm-line">
        <div class="bill-list-content">
            <ul class="bill-list-store credit-item active" data-role="billItem">
                <% if (data.length) { %>
                    <% data.forEach(function (item, index) { %>
                        <% if (userInfo){ %>
                            <li data-native-url="hybrid/app/my_point/page/exchange_page.js">
                        <% } else { %>
                            <li data-widget="hybrid/app/my_point/page/member.js#login">
                        <% } %>
                            <a href="javascript:;"
                            >
                                <img src="<%= item.img %>" alt="<%= item.name %>">
                                <div class="commodity-detail-box">
                                    <h2><%= item.name %></h2>
                                    <span class="exchange-condition">
                                    需要: <span class="text-red"><%= item.price %>金币</span>, <%= item.condition %></span>
                                    <div class="num-exchange-box">
                                        数量：<%= item.quantity %>
                                        <% var state = 'now'; if (item.status != 1){state = 'end'; }%>

                                    </div>
                                </div>
                            </a>
                            <hr class="sm-line list">
                        </li>
                    <% }) %>
                <% } %>
                <% if (userInfo){ %>
                    <li data-native-url="hybrid/app/my_point/page/exchange_page.js" class="btn-exchange-box">
                <% } else { %>
                    <li data-widget="hybrid/app/my_point/page/member.js#login" class="btn-exchange-box">
                <% } %>
                    <div class="btn-exchange">
                        查看更多奖品
                        <em></em>
                    </div>
                </li>
            </ul>
            <ul class="bill-list-store credit-item " data-role="billItem">
                <!-- <li class="member-rule">
                    <h2>
                        <em>1</em>
                        什么是S会员
                    </h2>
                    <p>
                        S会员是美家App忠爱粉的标志，当你持续发布优质笔记内容，就能成为会员啦！这里有花钱也买不到的内测版商品、众测资格，
                        <em>最重要的，只有成为会员，才能用金币兑换奖品</em>
                        ，后续还将推出你想不到的会员福利！
                    </p>
                </li> -->
                <li class="member-rule">
                    <h2>
                        <em>1</em>
                        如何成为S会员
                    </h2>
                    <p>
                        <em>最近30天，</em>有至少<em>4条笔记被推荐到首页</em>即可成为S会员。(<a href="http://m.dajia365.com/shaibei/get_recommend" class="text-blue">戳这里查看小秘诀</a>)

                        <br>当最近30天，被推荐到首页的笔记不足4条时，会员资格失效。

                        <br><em>只有成为会员，才能用金币兑换奖品。</em>
                    </p>

                </li>
                <li class="member-rule">
                    <h2>
                        <em>2</em>
                        如何获取金币？
                    </h2>
                    <p class="p-credit-rule mt13">
                        <em>笔记被推荐到首页 &nbsp;&nbsp;&nbsp; +20金币</em>
                    </p>
                    <p class="p-credit-rule mb15">
                        <em>笔记被喜欢 &nbsp;&nbsp;&nbsp; +1金币</em>
                    </p>
                    <p>金币兑换是为了更好的回馈大家，单条获取上限为<em>50金币</em>，单日获取上限为<em>200金币</em>。我们不允许灌水、恶意发布等行为，一旦发现将扣除或清零其金币。</p>
                </li>
            </ul>
        </div>
    </section>

</div>