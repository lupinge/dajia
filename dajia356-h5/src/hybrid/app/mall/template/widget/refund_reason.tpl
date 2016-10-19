<section class="refund-handel-box">
    <div class="refund-desc">
        <i class="red-star">*</i>
        <span class="refund-title">退款原因</span>
    </div>
    <select class="select-refund-handel" name="refund_reason">
        <% data.forEach(function(item){ %>
            <option value="<%= item %>"><%= item %></option>
        <% }) %>
    </select>
    <i class="i-arr"></i>
</section>