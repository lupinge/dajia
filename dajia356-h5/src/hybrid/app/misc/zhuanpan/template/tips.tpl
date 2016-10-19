<% if(data) {%>
<p class="chance-time">你还有 <span data-role='num'><%= data.left_chance_count %></span> 次抽奖机会</p>
<p class="chance-tip">发晒家图，被推荐一次，得一次额外抽奖机会～</p>
<% } else {%>
<p class="chance-tip">发晒家图，被推荐一次，得一次额外抽奖机会～</p>
<%} %>