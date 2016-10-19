<div class="content wrap-publish" data-widget="hybrid/app/misc/youyanji/page/pub_page.js#checkForm">
    <div class="step-title-box">
        <em></em>
        <span>1.选择抽油烟机品牌及型号</span>
    </div>
    <form data-role="pushForm">
        <input type="hidden" name="product_category_id" value="<%= brandData.A[0].product_category_id %>">
        <div class="select-brand-modle" data-widget="hybrid/app/misc/youyanji/page/pub_page.js#selectBrand">
            <div class="brand-box">
                <div class="brand-text">品牌</div>
                <div class="brand-select-box" data-role="brandSelectBox">
                    <span data-role="brandname">请选择品牌</span>
                    <input type="hidden" name="brand_id" data-role="brandIdInput" id="brandid">
                    <em><i data-role="iArr"></i></em>
                    <div class="brands-list" data-role="brandslist">
                        <ul>
                            <% Object.keys(brandData).forEach (function(letterItem){
                                 brandData[letterItem].forEach (function(item,index){ %>
                                    <li>
                                        <% if(index === 0){%>
                                            <em><%= item['letter']%>-</em>
                                        <% }else{%>
                                            <em></em>
                                        <% }%>
                                        <span data-pid="<%= item.brand_id %>"><%= item['brand_name'] %></span>
                                    </li>
                                <% })
                             }) %>
                            <li data-role="otherBrand">
                                <em>#</em>
                                <span data-pid="0">其他</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="user-write-brand" data-role="userWriteBrand">
                <input type="text" name="brand_name" placeholder="手动填选品牌" data-role="brandNameInput" id="brandname">
            </div>
            <div class="modle-box">
                <div class="modle-text">型号(选填)</div>
                <div class="modle-select-box">
                    <input type="text" name="model">
                </div>
            </div>
            <div class="select-brand-desc" data-role="selectBrandDesc">
                如无您要点评的品牌，请选 “ 其他 ” 分类
            </div>
        </div>
        <div class="step-title-box sec">
            <em></em>
            <span>2.写真实使用感受</span>
        </div>
        <div class="feel-tip">可从外形、性价比、安装售后服务等角度描述。<br>客观全面的评价会提高中奖几率哦~</div>
        <div class="good-middle-bad" data-widget="hybrid/app/misc/youyanji/page/pub_page.js#selectComment">
            <span class="comment-mark good-comment" data-commentmark="3">好评</span>
            <span class="comment-mark middle-comment" data-commentmark="2">中评</span>
            <span class="comment-mark bad-comment" data-commentmark="1">差评</span>
            <input type="hidden" name="score" data-role="commentMarkInput" id="commentmark">
        </div>
        <div class="comment-detail-box">
            <div class="textarea-box" data-widget="hybrid/app/misc/youyanji/page/pub_page.js#checkWordNum">
                <textarea name="comment" id="commentdetail" class="comment-detail-textarea" placeholder="吸力：" data-role="textArea"></textarea>
                <span class="words-num" data-role="wordsNum">0</span>
            </div>
            <div class="form-widget img-box" id="uploader"
                data-widget="hybrid/common/widget/uploader/uploader.js#upload"
                data-pick-id="#picker"
                data-img-wrap="#images_wrap"
                data-is-multiple="true"
                data-attach-config='{"type":2}'
                >
               <ul class="pub-pics" id="images_wrap">
                   <li class="up-entry" id="picker">
                        <div class="fack-input"></div>
                   </li>
               </ul>
            </div>
        </div>
        <div class="push-btn">
            <input type="submit" value="发布" data-role="pushBtn">
        </div>
    </form>
</div>