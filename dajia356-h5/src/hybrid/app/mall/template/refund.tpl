<div class="wrap refund-wrap" data-widget="hybrid/app/mall/refund.js#submitForm">
<form data-role="form">
    <div class="refund-table-box" data-role="refundTableBox">
        <section class="refund-tip">
            提示：请联系商家并协商好各项细节，否则申请有可能被拒绝，提交后不可修改哦
        </section>
        <section class="refund-handel-box">
            <div class="refund-desc">
                <i class="red-star">*</i>
                <span class="refund-title">申请服务</span>
            </div>
            <select class="select-refund-handel" name="refund_type" data-role="selectType">
                <option value="0">仅退款</option>
                <option value="1">退货退款</option>
            </select>
            <i class="i-arr"></i>
        </section>

        <div class="exchange-box1" data-role="refundDiffParent">
            <div id="refundDiff" class="refund-diff" data-role="refundDiffBox"></div>
        </div>

        <div class="exchange-box2" data-role="deliverStatusDiffParent">
            <div id="deliverStatusDiff" class="deliver-status-diff" data-role="deliverStatusDiffBox"></div>
        </div>

        <section class="refund-handel-box">
            <div class="refund-desc">
                <i class="red-star">*</i>
                <span class="refund-title">退款金额</span>
            </div>
            <div class="money-icon">￥</div>
            <input class="refund-input check money" type="number" name="refund_fee" data-desc="正确的退款金额" data-role="inputMoney" placeholder="请协商好金额，提交后不可修改" value="<%= data.total_fee %>">
        </section>
        <div class="refund-money-tip">
            (最多<span id="total_fee"><%= data.total_fee %></span>元, 含邮费<span id="logistic_fee"><%= data.logistic_fee %></span>元)
        </div>

        <section class="refund-handel-box">
            <div class="refund-desc">
                <span class="refund-title">退款说明</span>
            </div>
            <input class="refund-input" type="text" name="note" data-desc="退款说明" placeholder="填入退款说明，也可不填">
        </section>

        <section class="refund-images-box">
            <div class="form-widget img-box" id="uploader"
                data-widget="hybrid/common/widget/uploader/uploader.js#upload"
                data-pick-id="#picker"
                data-img-wrap="#images_wrap"
                data-is-multiple="true"
                data-attach-config='{"type":2,"attachnum":3}'
                >
               <ul class="refund-images-list pub-pics" id="images_wrap">
                   <li class="up-entry" id="picker">
                        <span class="upload-btn">
                            <div class="add-icon"></div>
                            <div class="add-tip">上传凭证<br>最多三张</div>
                        </span>
                   </li>
               </ul>
            </div>
        </section>
        <section class="bottom-bar">
            <hr class="sm-line top">
            <button class="btn-buy btn-refund-submit" type="submit" data-role="submitBtn">提交申请</button>
        </section>
    </div>
    <section class="success-mask" data-role="successMask">
        <img class="refund-success-tip" src="/dj/hybrid/app/mall/img/i-green-tip.png" alt="">
        <div class="refund-success-text">
            申请已提交
            <br>
            商家确认无误后，即可收到退款
        </div>
        <a class="btn-order-detail" data-role="orderDetailA" href="javascript:;">查看订单</a>
    </section>
</form>
</div>
