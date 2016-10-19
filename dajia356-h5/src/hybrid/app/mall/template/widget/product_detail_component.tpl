<div class="wrap product-detail-wrap" data-widget="hybrid/app/mall/product_detail.js#buyForm">
<form data-role="form">
<% if (data) { %>
    <section class="product-detail-content component">
        <div class="product-c-tab">
            <span>图文详情</span>
        </div>
        <hr class="sm-line">
        <div id="image_text" class="product-image-text component show">
            <%= data.detail %>
        </div>
    </section>
<% }else{ %>
    <div style="display: table; width: 100%; position: absolute;height: 80%;">
           <p style="display: table-cell;vertical-align: middle;text-align: center; ">商品已下架～</p>
    </div>
<% } %>
</form>
</div>
