<% if(data && data.id) {%>
    <div class="exist-address" data-role="existAddress">
        <div class="address-display-box" data-role="wholeAddress">
            <div class="address-name-tel">
                <i></i>
                <span class="address-name">收货人：<%= data.name %></span>
                <span class="address-tel"><%= data.phone %></span>
            </div>
            <div class="address-detail">
                收货地址：<%= data.province + data.city + data.district + data.address %>
            </div>
        </div>
        <hr class="sm-line">
        <a href="javascript:void(0)" class="address-update-box" data-role="updateAddress">
            <i class="address-update-icon"></i>
            修改地址
            <i class="address-update-arrow"></i>
        </a>
    </div>
    <input type="hidden" name="contact_addr_id" value="<%= data.id %>" data-role="addressID">
<% }else{ %>
    <div class="add-address">
        <a href="javascript:void(0)" data-role="addAddress">+添加地址</a>
    </div>
    <input type="hidden" name="contact_addr_id" value="" data-role="addressID">
<% } %>
