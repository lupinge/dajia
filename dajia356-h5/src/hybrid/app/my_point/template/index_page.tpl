<div class="content">
    <% var defAvatar = '/dj/hybrid/app/my_point/img/i_out_login.png';%>
    <% var arr = ['yellow','yellow','yellow','yellow','yellow','yellow','green','green','green','blue','blue','blue','purple','purple','purple','purple'
        ]; %>
    <% if (userInfo) {%>
        <section class="member-desc">
            <img src="<%= userInfo.avatar || defAvatar %>" class="user-photo" alt="">
            <div class="user-name-box">
                <%= userInfo.name || userInfo.user_name%>
                <span class="btn-level btn-level-<%= arr[credit_info.currentLevelIndex - 1]%> user-level">
                    <%= credit_info.currentLevel %></span>
            </div>
            <div class="user-contribute-text">
                积分 <em> <%= credit_info.totalCredit %></em>
            </div>
        </section>
    <%} else{ %>
        <section class="member-desc">
            <img src="<%= defAvatar %>" class="user-photo" alt="">
            <div class="user-name-box">
             立即登录
            </div>
        </section>
    <% } %>

    <hr class="sm-line top">
    <section class="bill-handel mt10"
        data-widget="hybrid/app/my_point/page/exchange_page.js#tab"
    >
        <hr class="sm-line top">
        <div class="credit-tab">
            <div class="credit-left active" data-role="billTab"> <em></em>
                积分明细
                <hr class="sm-line vertical"></div>
            <div class="credit-right " data-role="billTab">
                <em></em>
                积分规则
            </div>
        </div>
        <hr class="sm-line">
        <div class="credit-item active" data-role="billItem">
            <div class="level-detail-box" >
                <span class="level-up-desc">距离下一等级还需
                <%= credit_info.nextLevelPoint - credit_info.totalCredit %>
                分
                </span>
                <div class="level-line-box">
                    <div class="line-all">
                        <div class="limit-point first-point <%= credit_info.totalCredit >credit_info.currentLevelPoint ? 'active' : '' %>">
                            <div class="line-desc line-desc-left left"><span class="btn-level btn-level-<%= arr[credit_info.currentLevelIndex - 1]%> line-level "><%= credit_info.currentLevel%>
                                </span>（<%= credit_info.currentLevelPoint %>）</div>
                        </div>
                        <div class="limit-point second-point <%= credit_info.totalCredit >credit_info.nextLevelPoint ? 'active' : '' %>">
                            <div class="line-desc line-desc-right right"><span class="btn-level btn-level-<%= arr[credit_info.currentLevelIndex]%> line-level" ><%= credit_info.nextLevel%></span>（<%= credit_info.nextLevelPoint %>）</div>
                        </div>
                        <div class="line-block-red"></div>
                        <div class="line-red-box">
                            <div class="line-cur" style="width:<%= credit_info.rate %>%">
                                <span class="credit-num-tip">
                                    <em></em>
                                    <%= credit_info.totalCredit %></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="sm-line top">
            <div class="bill-list-content" >
                <% if (credit_log.length >
                0) { %>
                <ul id="point" class="bill-list-detail active">
                    <% credit_log.forEach(function(item){ if(Array.isArray(item)) {return false;}%>
                    <li>
                        <div class="bill-state-box">
                            <% if (item.affect < 0) { %>
                            <span class="score-state reduce">
                                <%= item.affect %></span>
                            <%} else { %>
                            <span class="score-state ">
                                <%= item.affect == '0'? item.affect : '+' + item.affect %></span>
                            <% } %></div>
                        <div class="exchange-detail">
                            <h2>
                                <%= item.descrip %></h2>
                            <span class="exchange-condition mt5">
                                <%= dateformat(item.insert_time * 1000, 'yy-mm-dd HH:MM') %></span>
                        </div>
                        <hr class="sm-line list">
                    </li>
                    <%}) %></ul>
                <%if(total_page >
                current_page){%>
                <div data-widget="hybrid/app/my_point/page/index_page.js#loadMore"
                    data-role="load_more"
                    data-uri='membership/log'
                    data-type="1"
                    data-refer="#point"
                    class="load-more-box" >
                    展开更多
                    <em></em>
                </div>
                <%} %>
                <% } else {%>
                <div class="load-more-box">暂无明细</div>
                <% } %></div>
        </div>
        <ul class="bill-list-store credit-item" data-role="billItem">
            <li class="member-rule">
                <h2>
                    <em>1</em>
                    积分是什么？
                </h2>
                <p>参与互动就能得到积分啦，积分用于提升自己的等级。越高的等级可以开启越多的特权哦~</p>
            </li>
            <li class="member-rule">
                <h2>
                    <em>2</em>
                    怎样获取积分？
                </h2>
                <p class="p-credit-rule mt13">
                    发布笔记
                    <span class="red-tip">+10分</span>
                </p>
                <p class="p-credit-rule">
                    评论他人笔记
                    <span class="red-tip">+2分</span>
                </p>
                <p class="p-credit-rule">
                    给他人笔记点赞
                    <span class="red-tip">+1分</span>
                </p>
                <p class="p-credit-rule mb15">
                    原创投稿
                    <span class="red-tip">+50分</span>
                </p>
            </li>
            <li class="member-rule">
                <h2>
                    <em>3</em>
                    积分和等级如何对应？
                </h2>
                <p class="p-credit-rule mt13">
                    <span class="btn-level btn-level-yellow">LV.1</span>
                    <span class="gray-tip">0分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-yellow">LV.2</span>
                    <span class="gray-tip">15分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-yellow">LV.3</span>
                    <span class="gray-tip">40分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-yellow">LV.4</span>
                    <span class="gray-tip">70分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-yellow">LV.5</span>
                    <span class="gray-tip">120分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-yellow">LV.6</span>
                    <span class="gray-tip">200分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-green">LV.7</span>
                    <span class="gray-tip">350分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-green">LV.8</span>
                    <span class="gray-tip">500分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-green">LV.9</span>
                    <span class="gray-tip">700分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-blue">LV.10</span>
                    <span class="gray-tip">1000分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-blue">LV.11</span>
                    <span class="gray-tip">1300分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-blue">LV.12</span>
                    <span class="gray-tip">1600分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-purple">LV.13</span>
                    <span class="gray-tip">2100分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-purple">LV.14</span>
                    <span class="gray-tip">2600分</span>
                </p>
                <p class="p-credit-rule">
                    <span class="btn-level btn-level-purple">LV.15</span>
                    <span class="gray-tip">3100分</span>
                </p>
                <p class="p-credit-rule mb15">
                    <span class="btn-level btn-level-purple">LV.16</span>
                    <span class="gray-tip">3600分</span>
                </p>
            </li>
            <li class="member-rule">
                <h2>
                    <em>4</em>
                    补充说明
                </h2>
                <p>
                    积分等级制度是为了更好的激励大家，单日可获取积分上限为<em>1000</em>分。我们不允许刷分、灌水、恶意发布等行为，一旦发现将扣除或清零其积分。
                </p>
            </li>
        </ul>

    </section>
</div>