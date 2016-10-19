<% if(data){ %>
    <div class="wrap logistic-detail-wrap">
        <section class="logistic-top-box">
            <div class="logistic-img-box">
                <img src="<%= logisticBasicData.merchandise_image%>" alt="">
                <div class="logistic-img-desc">共<%= logisticBasicData.merchandise_quantity %>件商品</div>
            </div>
            <div class="logistic-desc">
                <div class="logistic-detail-state">物流状态<span><%= logisticBasicData.logistic_status_text %></span></div>
                <div class="logistic-merchant">承运物流<span><%= logisticBasicData.logistic_type_text %></span></div>
                <div class="logistic-order-num">物流编号<span><%= logisticBasicData.logistic_no %></span></div>
            </div>
        </section>
        <section class="logistic-table">
            <div class="logistic-table-title">物流跟踪</div>
            <hr class="sm-line">
            <div class="logistic-table-detail" data-widget="hybrid/app/mall/logistic_detail.js#canvasLine">
                <% var count = 0 %>
                <% Object.keys(data.traces).forEach(function(){ %>
                    <% count++ %>
                <% }) %>
                <% Object.keys(data.traces).reverse().forEach(function(item, index){ %>
                    <div class="logistic-item">
                        <div class="i-item-point"></div>
                        <div class="line-mask"></div>
                        <div class="logistic-item-content">
                            <%= data.traces[item] %><br>
                            <%= dateformat(item * 1000,'yyyy-mm-dd HH:MM:ss') %>
                        </div>
                    </div>
                    <% if(index < count-1){ %>
                        <hr class="sm-line">
                    <% } %>
                <% }) %>

                <div class="vertical-line"></div>
            </div>
        </section>
    </div>
<% }else{ %>
    <div style="display: table; width: 100%; padding: 50% 0; background-color: #fff;">
           <p style="display: table-cell;vertical-align: middle;text-align: center; ">暂无相关信息～</p>
    </div>
<% } %>