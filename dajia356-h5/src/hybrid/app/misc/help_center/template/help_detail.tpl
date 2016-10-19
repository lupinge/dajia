<div class="wrap help-detail-wrap">
    <div class="help-detail-title">Q&A</div>
    <% data.forEach(function(item, index){ %>
        <h2><%= index+1 + '、' + item.third_title %></h2>
        <p><%= item.content %></p>
    <% }) %>
</div>