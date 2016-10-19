<section class="refund-handel-box">
    <div class="refund-desc">
        <i class="red-star">*</i>
        <span class="refund-title">选择物流</span>
    </div>
    <select class="select-refund-handel" name="logistic_type">
        <% Object.keys(data).forEach(function(item){ %>
            <option value="<%= item %>"><%= data[item] %></option>
        <% }) %>
    </select>
    <i class="i-arr"></i>
</section>
<section class="refund-handel-box">
    <div class="refund-desc">
        <i class="red-star">*</i>
        <span class="refund-title">运单号</span>
    </div>
    <input class="refund-input check" type="number" name="logistic_no" data-desc="正确的运单号" placeholder="输入运单号">
</section>