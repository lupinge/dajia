<div class="mask-c" data-role="maskCont">
    <div class="address-item">
        <lable>收件人</lable>
        <input type="text" name="name" class="address-input name" placeholder="姓名" value="" data-role="inputAddress" data-attri="姓名">
    </div>
    <hr class="sm-line">
    <div class="address-item">
        <lable>手机号码</lable>
        <input type="tel"  name="phone" class="address-input tel" placeholder="手机号码" value="" data-role="inputAddress" data-attri="手机号码">
    </div>
    <hr class="sm-line">
    <div class="address-item">
        <input type="hidden" name="country" value="中国">
        <lable>所在地区</lable>
        <div id="city_select" class="city-select">
            <div class="select-box " data-role="selectBox">
                <select class="select-province" name="province" data-role="select">
                    <% data.forEach(function(item, index){ %>
                        <option value="<%= item.name %>" data-opt-index="<%= index %>"><%= item.name %></option>
                    <% }) %>
                </select>
                <i></i>
            </div>
            <div class="select-box " data-role="selectBox">
                <select class="select-city" name="city" data-role="select">
                    <% data[0].children.forEach(function(item, index){ %>
                        <option value="<%= item.name %>" data-opt-index="<%= index %>" ><%= item.name %></option>
                    <% }) %>
                </select>
                <i></i>
            </div>
            <div class="select-box " data-role="selectBox">
                <select class="select-district" name="district" data-role="select">
                    <% data[0].children[0].children.forEach(function(item, index){ %>
                        <option value="<%= item.name %>" data-opt-index="<%= index %>" ><%= item.name %></option>
                    <% }) %>
                </select>
                <i></i>
            </div>
        </div>
    </div>
    <hr class="sm-line">
    <div class="address-item">
        <lable>街道地址</lable>
        <input type="text" name="address" class="address-input street" placeholder="街道地址" data-role="inputAddress" data-attri="街道地址">
    </div>
    <hr class="sm-line">
    <div class="btn-address-box">
        <a class="btn-address btn-close-address thin-border" href="javascript:void(0)" data-role="closeBtn">取消</a>
        <button type="submit" class="btn-address btn-save-address" data-role="saveBtn">保存</button>
    </div>
</div>